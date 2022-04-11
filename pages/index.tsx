import type { NextPage } from "next";
import { MouseEventHandler } from "react";

const Home: NextPage = () => {
  const handleClick = (
    endpoint: string,
    method: "POST" | "GET"
  ): MouseEventHandler => {
    const handler: MouseEventHandler = async () => {
      const res = await fetch(endpoint, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body:
          method !== "GET"
            ? JSON.stringify({
                email: "test@mail.com",
                password: "testpass",
              })
            : undefined,
      });
      const data = await res.json();

      console.log(data);
    };
    return handler;
  };

  return (
    <>
      Tests
      <div>
        <button onClick={handleClick("/api/auth/signup", "POST")}>
          Signup
        </button>
        <button onClick={handleClick("/api/auth/login", "POST")}>Login</button>
        <button onClick={handleClick("/api/auth/me", "GET")}>Me</button>
        <button onClick={handleClick("/api/auth/logout", "GET")}>Logout</button>
      </div>
    </>
  );
};

export default Home;
