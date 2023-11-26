import { Inter } from "next/font/google";
import React, { useEffect, useState } from "react";

const inter = Inter({ subsets: ["latin"] });

function App() {
  return (
    <>
      <p>CS411 Project</p>
      <p>
        This website will generate you a playlist whose track's names are based
        on a random generated quote
      </p>
    </>
  );
}
export default App;
