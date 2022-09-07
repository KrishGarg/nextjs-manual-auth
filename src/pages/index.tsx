import type { NextPage } from "next";
import { useCallback, useState } from "react";

import trpc from "@/hooks/trpc";
import {
  deleteAccessTokenInfo,
  deleteRefreshTokenInfo,
  getRefreshTokenInfo,
  setAccessTokenInfo,
  setRefreshTokenInfo,
} from "@/auth/frontend/tokens";

const testCreds = {
  email: "test1@mail.com",
  password: "testpass",
};

const Home: NextPage = () => {
  const [result, setResult] = useState({});

  // TODO: Extract the login methods to separate hooks for better management.
  const onSettled = useCallback((data, error) => {
    if (error) {
      setResult(`Error: ${error.message}`);
    } else {
      setResult(data);
    }
  }, []);

  const onSuccess = useCallback((data) => {
    const {
      tokens: {
        access: {
          token: accessToken,
          expiresInSeconds: accessTokenExpiresInSeconds,
        },
        refresh: {
          token: refreshToken,
          expiresInSeconds: refreshTokenExpiresInSeconds,
        },
      },
    } = data;

    setAccessTokenInfo(accessToken, accessTokenExpiresInSeconds);
    setRefreshTokenInfo(refreshToken, refreshTokenExpiresInSeconds);
  }, []);

  const login = trpc.useMutation(["auth.login"], {
    onSettled,
    onSuccess,
  });
  const signup = trpc.useMutation(["auth.signup"], {
    onSettled,
    onSuccess,
  });
  const refresh = trpc.useMutation(["auth.refresh"], {
    onSettled,
    onSuccess,
  });
  const logout = trpc.useMutation(["auth.logout"], {
    onSettled,
    onSuccess: () => {
      deleteAccessTokenInfo();
      deleteRefreshTokenInfo();
    },
  });
  const superlogout = trpc.useMutation(["auth.superlogout"], {
    onSettled,
    onSuccess: () => {
      deleteAccessTokenInfo();
      deleteRefreshTokenInfo();
    },
  });
  const me = trpc.useQuery(["user.me"], {
    onSettled,
    enabled: false,
  });

  return (
    <>
      Tests
      <div>
        <button
          onClick={async () => {
            signup.mutate({
              email: testCreds.email,
              password: testCreds.password,
            });
          }}
        >
          Signup
        </button>
        <button
          onClick={async () => {
            login.mutate({
              email: testCreds.email,
              password: testCreds.password,
            });
          }}
        >
          Login
        </button>
        <button
          onClick={async () => {
            me.refetch();
          }}
        >
          Me
        </button>
        <button
          onClick={async () => {
            const refreshToken = getRefreshTokenInfo();
            if (!refreshToken) return;
            logout.mutate({ refreshToken: refreshToken.token });
          }}
        >
          Logout
        </button>
        <button
          onClick={async () => {
            const refreshToken = getRefreshTokenInfo();
            if (!refreshToken) return;
            refresh.mutate({ refreshToken: refreshToken.token });
          }}
        >
          Refresh Tokens
        </button>
        <button
          onClick={async () => {
            const refreshToken = getRefreshTokenInfo();
            if (!refreshToken) return;
            superlogout.mutate();
          }}
        >
          Super Logout
        </button>
      </div>
      <pre>
        <code>{JSON.stringify(result, null, 4)}</code>
      </pre>
    </>
  );
};

export default Home;
