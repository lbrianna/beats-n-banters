// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import React, { useEffect, useState } from "react";
type Data = {
  name: string;
};

export default async function handler(req: any, res: any) {
  // Using a fetch here but could be any async operation to an external source
  const response = await fetch("https://techy-api.vercel.app/api/json");
  const jsonData = await response.json();
  res.status(200).json(jsonData);
}
