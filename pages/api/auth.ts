import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";

export default async function githubAuth(req: NextApiRequest, res: NextApiResponse) {
  const { authorization } = req.headers;
  const token = authorization as string; 

  const tokenDecoded = JSON.parse(JSON.stringify(jwt.decode(token) as string));

  if (!tokenDecoded) {
    return res.send({
      isAuthenticated: false,
    })
  }

  const response = await fetch(
    `https://api.github.com/users/${tokenDecoded.githubUser}`
  );
  try {
    const data = await response.json();

    if (data.message === "Not Found" || !data) {
        res.send({
          isAuthenticated: false,
        });
      } else {
        res.send({
          isAuthenticated: true,
        });
      }
  } catch(error) {
    res.send({
        isAuthenticated: false,
    });
  }
  
}
