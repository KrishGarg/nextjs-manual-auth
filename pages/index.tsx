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
  deleteAccessTokenInfo,
  deleteRefreshTokenInfo,
  getRefreshTokenInfo,
  setAccessTokenInfo,
  setRefreshTokenInfo,
} from "@/lib/auth/frontend/tokens";
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
                if (accessToken && accessTokenExpiresInSeconds) {
                  setAccessTokenInfo(accessToken, accessTokenExpiresInSeconds);
                }
                if (refreshToken && refreshTokenExpiresInSeconds) {
                  setRefreshTokenInfo(
                    refreshToken,
                    refreshTokenExpiresInSeconds
                  );
                }
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
                if (accessToken && accessTokenExpiresInSeconds) {
                  setAccessTokenInfo(accessToken, accessTokenExpiresInSeconds);
                }
                if (refreshToken && refreshTokenExpiresInSeconds) {
                  setRefreshTokenInfo(
                    refreshToken,
                    refreshTokenExpiresInSeconds
                  );
                }
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
              const token = getRefreshTokenInfo();
              if (!token) return;
              const res = await axios.post<
                {},
                AxiosResponse<LogoutResponseBody>,
                LogoutRequestBody
              >("/auth/logout", {
                refreshToken: token.token,
              });

              const { error } = res.data;

              if (!error) {
                deleteAccessTokenInfo();
                deleteRefreshTokenInfo();
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
              const token = getRefreshTokenInfo();
              if (!token) return;
              const res = await axios.post<
                {},
                AxiosResponse<RefreshResponseBody>,
                RefreshRequestBody
              >("/auth/refresh", {
                refreshToken: token.token,
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
                if (accessToken && accessTokenExpiresInSeconds) {
                  setAccessTokenInfo(accessToken, accessTokenExpiresInSeconds);
                }
                if (refreshToken && refreshTokenExpiresInSeconds) {
                  setRefreshTokenInfo(
                    refreshToken,
                    refreshTokenExpiresInSeconds
                  );
                }
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
