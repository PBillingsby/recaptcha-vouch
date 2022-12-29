// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import express from "express";
const router = express.Router();
const app = express();
import cors from 'cors';
import axios from 'axios';

type Data = {
  message: string
  status: string
}

app.use(cors());

//Parse data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", router);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  //POST route
  //Destructuring response token from request body
  const { token, address } = req.body;

  //sends secret key and response token to google
  await axios.post(
    `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.SECRET_KEY}&response=${token}`
  );

  //check response status and send back to the client-side
  if (res.status(200)) {
    deployTxn(address)
    res.status(200).json({
      status: "success",
      message: "Enquiry submitted successfully",
    });
  } else {
    res.status(405).json({
      status: "failure",
      message: "Error submitting the enquiry form",
    });
  }
}

const deployTxn = (address: string) => {
  try {
    console.log("DEPLOYING TXN TO: ", address)

  } catch (err) {
    console.log(err)
  }
}
