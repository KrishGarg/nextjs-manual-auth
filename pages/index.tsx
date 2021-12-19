import type { NextPage } from "next";
import { useState } from "react";

const Home: NextPage = () => {
  const [text, setText] = useState("");

  const handleClick = async () => {
    const res = await fetch("/api/auth/me");
    setText(await res.text());
  };

  return (
    <div>
      <button onClick={handleClick}>Get it</button>
      {text}
    </div>
  );
};

export default Home;
