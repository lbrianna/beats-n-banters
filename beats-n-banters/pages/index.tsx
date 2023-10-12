import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import React, { useEffect, useState } from "react";

const inter = Inter({ subsets: ["latin"] });
const Home: React.FC = () => {
  const [text, setText] = useState("");
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
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  console.log(text);

  return (
    <>
      <p>{text}</p>
    </>
  );
};
export default Home;
