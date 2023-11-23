import React, { useEffect, useState } from "react";

function App() {
  let text: any;
  //Fetching Techy API
  const fetchData = async () => {
    try {
      await fetch("http://localhost:3000/api/hello", {
        method: "GET",
        headers: { "Access-Control-Allow-Origin": "*" },
      })
        .then((response) => response.json())
        .then((data: any) => {
          text = data.message;
        });
    } catch (error) {
      console.log(error);
    }
  };
  let username: any;
  let title: any;
  const fetchapp = async () => {
    await fetchData();
    try {
      await fetch(
        `http://localhost:5001/playlist/${username}/${title}/${text}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
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
  useEffect(() => {
    // Retrieve user data from localStorage
    const userDataString = localStorage.getItem("userData");
    const userData = userDataString ? JSON.parse(userDataString) : null;

    // Access userData here
    if (userData) {
      username = userData[0];
      title = userData[1];
    }
    fetchapp();
  }, []);
  return (
    <>
      <p>Hello</p>
    </>
  );
}
export default App;
