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
} from "@/lib/sharedTypes";
import { AxiosResponse } from "axios";
import { setAccessToken } from "@/lib/accesstoken";
// normally all of these would be in different pages

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

              const { accessToken, refreshToken, error } = res.data;

              if (!error) {
                setAccessToken(accessToken ? accessToken : "");
                localStorage.setItem(
                  "refresh-token",
                  refreshToken ? refreshToken : ""
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

              const { accessToken, refreshToken, error } = res.data;

              if (!error) {
                setAccessToken(accessToken ? accessToken : "");
                localStorage.setItem(
                  "refresh-token",
                  refreshToken ? refreshToken : ""
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
                refreshToken: localStorage.getItem("refresh-token")!,
              });

              const { error } = res.data;

              if (!error) {
                setAccessToken("");
                localStorage.setItem("refresh-token", "");
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

              const { error, accessToken, refreshToken } = res.data;

              if (!error) {
                setAccessToken(accessToken ? accessToken : "");
                localStorage.setItem(
                  "refresh-token",
                  refreshToken ? refreshToken : ""
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
