import type { NextPage } from "next";
import { useState } from "react";

import axios from "@/lib/axios";
import {
  LoginRequestBody,
  LoginResponseBody,
  LogoutRequestBody,
  LogoutResponseBody,
  RefreshRequestBody,
  RefreshResponseBody,
  SignupRequestBody,
  SignupResponseBody,
  MeRequestBody,
  MeResponseBody,
} from "@/lib/auth/sharedTypes";
import { AxiosResponse } from "axios";
import {
  setAccessToken,
  setAccessTokenExpiresAt,
} from "@/lib/auth/frontend/accesstoken";
// normally all of these would be in different pages

// TODO: Clean up and organize code better

const testCreds = {
  email: "test1@mail.com",
  password: "testpass",
};

const Home: NextPage = () => {
  const [result, setResult] = useState({});
  return (
    <>
      Tests
      <div>
        <button
          onClick={async () => {
            try {
              const res = await axios.post<
                {},
                AxiosResponse<SignupResponseBody>,
                SignupRequestBody
              >("/auth/signup", {
                email: testCreds.email,
                password: testCreds.password,
              });

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
                error,
              } = res.data;

              if (!error) {
                if (accessToken) setAccessToken(accessToken);
                if (accessTokenExpiresInSeconds)
                  setAccessTokenExpiresAt(
                    Date.now() + accessTokenExpiresInSeconds * 1000
                  );
                if (refreshToken && refreshTokenExpiresInSeconds)
                  localStorage.setItem(
                    "refresh-token",
                    JSON.stringify({
                      token: refreshToken,
                      expiresAt:
                        Date.now() + refreshTokenExpiresInSeconds * 1000,
                    })
                  );
              }
              setResult(res.data);
            } catch (e) {
              console.error(e);
            }
          }}
        >
          Signup
        </button>
        <button
          onClick={async () => {
            try {
              const res = await axios.post<
                {},
                AxiosResponse<LoginResponseBody>,
                LoginRequestBody
              >("/auth/login", {
                email: testCreds.email,
                password: testCreds.password,
              });

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
                error,
              } = res.data;

              if (!error) {
                if (accessToken) setAccessToken(accessToken);
                if (accessTokenExpiresInSeconds)
                  setAccessTokenExpiresAt(
                    Date.now() + accessTokenExpiresInSeconds * 1000
                  );
                if (refreshToken && refreshTokenExpiresInSeconds)
                  localStorage.setItem(
                    "refresh-token",
                    JSON.stringify({
                      token: refreshToken,
                      expiresAt:
                        Date.now() + refreshTokenExpiresInSeconds * 1000,
                    })
                  );
              }
              setResult(res.data);
            } catch (e) {
              console.error(e);
            }
          }}
        >
          Login
        </button>
        <button
          onClick={async () => {
            try {
              const res = await axios.get<
                {},
                AxiosResponse<MeResponseBody>,
                MeRequestBody
              >("/me");

              setResult(res.data);
            } catch (e) {
              console.error(e);
            }
          }}
        >
          Me
        </button>
        <button
          onClick={async () => {
            try {
              const res = await axios.post<
                {},
                AxiosResponse<LogoutResponseBody>,
                LogoutRequestBody
              >("/auth/logout", {
                refreshToken: JSON.parse(localStorage.getItem("refresh-token")!)
                  ?.token,
              });

              const { error } = res.data;

              if (!error) {
                setAccessToken("");
                localStorage.setItem("refresh-token", JSON.stringify({}));
              }

              setResult(res.data);
            } catch (e) {
              console.error(e);
            }
          }}
        >
          Logout
        </button>
        <button
          onClick={async () => {
            try {
              const res = await axios.post<
                {},
                AxiosResponse<RefreshResponseBody>,
                RefreshRequestBody
              >("/auth/refresh", {
                refreshToken: localStorage.getItem("refresh-token")!,
              });

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
                error,
              } = res.data;

              if (!error) {
                if (accessToken) setAccessToken(accessToken);
                if (accessTokenExpiresInSeconds)
                  setAccessTokenExpiresAt(
                    Date.now() + accessTokenExpiresInSeconds * 1000
                  );
                if (refreshToken && refreshTokenExpiresInSeconds)
                  localStorage.setItem(
                    "refresh-token",
                    JSON.stringify({
                      token: refreshToken,
                      expiresAt:
                        Date.now() + refreshTokenExpiresInSeconds * 1000,
                    })
                  );
              }

              setResult(res.data);
            } catch (e) {
              console.error(e);
            }
          }}
        >
          Refresh Tokens
        </button>
      </div>
      <pre>
        <code>{JSON.stringify(result, null, 4)}</code>
      </pre>
    </>
  );
};

export default Home;
