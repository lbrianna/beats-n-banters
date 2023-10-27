import { Inter } from "next/font/google";
import React, { useEffect, useState } from "react";

const inter = Inter({ subsets: ["latin"] });

function App() {
  const [text, setText] = useState("");
  //Fetching Techy API
  const fetchData = async () => {
    try {
      await fetch("http://localhost:3000/api/hello", {
        method: "GET",
        headers: { "Access-Control-Allow-Origin": "*" },
      })
        .then((response) => response.json())
        .then((data: any) => {
          setText(data.message);
        });
      let textArray = text.split(" ");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <p>{text}</p>
      <button onClick={fetchData}>Press me</button>
    </>
  );
}
export default App;
