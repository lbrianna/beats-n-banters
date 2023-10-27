import { Inter } from "next/font/google";
import React, { useEffect, useState } from "react";
import "dotenv/config";

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
      for (let i = 0; i < textArray.length; i++) {
        await search(textArray[i]);
      }
    } catch (error) {
      console.log(error);
    }
  };
  //Fetching Spotify API
  const CLIENT_ID = process.env.NEXT_PUBLIC_API_KEY;
  const CLIENT_SECRET = process.env.NEXT_PUBLIC_API_SECRET;
  const [accessToken, setaccessToken] = useState("");
  useEffect(() => {
    //API Access Token
    var authParameters = {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body:
        "grant_type=client_credentials&client_id=" +
        CLIENT_ID +
        "&client_secret=" +
        CLIENT_SECRET,
    };
    console.log(authParameters);
    fetch("https://accounts.spotify.com/api/token", authParameters)
      .then((result) => result.json())
      .then((data) => setaccessToken(data.access_token));
  }, []);
  //We need to: 1-Define a search function to look up every song name on spotify
  // 2- After song is found: add it to the playlist (additional helper function)
  async function search(word: string) {
    //Get song with given word
    var songParameters = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
    };
    var songID = await fetch(
      "https://api.spotify.com/v1/search?q=" + word + "&type=track&limit=50",
      songParameters
    )
      .then((response) => response.json())
      .then((data) => console.log(data));
  }
  //Main
  search("easiest");
  return (
    <>
      <p>{text}</p>
      <button onClick={fetchData}>Press me</button>
    </>
  );
}
export default App;
