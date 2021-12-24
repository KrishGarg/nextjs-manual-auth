import type { NextPage } from "next";
import { MouseEventHandler } from "react";

const Home: NextPage = () => {
  const handleClick = (endpoint: string): MouseEventHandler => {
    const handler: MouseEventHandler = async () => {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "test@mail.com",
          password: "testpass",
        }),
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
        <button onClick={handleClick("/api/auth/signup")}>Signup</button>
        <button onClick={handleClick("/api/auth/login")}>Login</button>
        <button onClick={handleClick("/api/auth/me")}>Me</button>
        <button onClick={handleClick("/api/auth/logout")}>Logout</button>
      </div>
    </>
  );
};

export default Home;
