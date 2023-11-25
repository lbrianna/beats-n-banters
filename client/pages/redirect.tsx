import React, { useEffect, useState } from "react";

function App() {
  let i = 0;

  useEffect(() => {
    if (i === 0) {
      getQuote();
    }
  }, [i]);

  // Fetching Techy API
  const getQuote = async () => {
    i = 1;
    try {
      await fetch("http://localhost:3000/api/hello", {
        method: "GET",
      })
        .then((response) => response.json())
        .then((data: any) => {
          // Retrieve user data from localStorage
          const userDataString = localStorage.getItem("userData");
          const userData = userDataString ? JSON.parse(userDataString) : null;

          let username: string;
          let title: string;

          if (userData) {
            username = userData[0];
            title = userData[1];
            fetchApp({ username, title, text: data.message });
          }
        });
    } catch (error) {
      console.log(error);
    }
  };

  interface FetchAppParams {
    username: string;
    title: string;
    text: string;
  }

  const fetchApp = async ({ username, title, text }: FetchAppParams) => {
    try {
      await fetch(
        `http://localhost:5001/playlist/${username}/${title}/${text}`,
        {
          method: "GET",
          // headers: { "Content-Type": "application/json" },
        }
      )
        .then((response) => response.json())
        .then((data: any) => {
          console.log(data);
        });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <p>Hello</p>
    </>
  );
}
export default App;
