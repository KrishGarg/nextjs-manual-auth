import "../styles/globals.css";

import { withTRPC } from "@trpc/next";
import type { AppType } from "next/dist/shared/lib/utils";
import type { AppRouter } from "@/server/routers";

import { getAccessTokenInfo } from "@/lib/auth/frontend/tokens";

const MyApp: AppType = ({ Component, pageProps }) => {
  return <Component {...pageProps} />;
};

export default withTRPC<AppRouter>({
  config({ ctx }) {
    const headers = (ssr = false) => {
      return () => {
        const accessToken = getAccessTokenInfo();
        return {
          Authorization: accessToken
            ? `Bearer ${accessToken.token}`
            : undefined,
          "x-ssr": ssr ? "1" : undefined,
        };
      };
    };

    if (typeof window !== "undefined") {
      // during client requests
      return {
        url: "/api/trpc",
        headers: headers(),
      };
    }

    const ONE_DAY_SECONDS = 60 * 60 * 24;
    ctx?.res?.setHeader(
      "Cache-Control",
      `s-maxage=1, stale-while-revalidate=${ONE_DAY_SECONDS}`
    );

    const url = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}/api/trpc`
      : "http://localhost:3000/api/trpc";

    return {
      url,
      headers: headers(true),
    };
  },
  ssr: true,
})(MyApp);
