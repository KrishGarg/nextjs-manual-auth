import type { NextPage } from "next";
import { useState } from "react";

import axios from "@/lib/axios";
import {
  login,
  logout,
  refresh,
  signup,
  superlogout,
} from "@/lib/auth/frontend/methods";

import { AxiosResponse } from "axios";
import { MeRequestBody, MeResponseBody } from "@/lib/types/endpoint";

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
            const data = await signup(testCreds.email, testCreds.password);
            if (data) setResult(data);
          }}
        >
          Signup
        </button>
        <button
          onClick={async () => {
            const data = await login(testCreds.email, testCreds.password);
            if (data) setResult(data);
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
            const data = await logout();
            if (data) setResult(data);
          }}
        >
          Logout
        </button>
        <button
          onClick={async () => {
            const data = await refresh();
            if (data) setResult(data);
          }}
        >
          Refresh Tokens
        </button>
        <button
          onClick={async () => {
            const data = await superlogout();
            if (data) setResult(data);
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
