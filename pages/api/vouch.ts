// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import express from "express";
const app = express();
import cors from 'cors';

import verify from '../../utils/verify'
import vouch from '../../utils/vouch'
import dao from '../../utils/dao'

app.use(cors());

export default async function handler(
  req: NextApiRequest,
  res: any
) {
  //POST route
  //Destructuring response token from request body
  verify(req.body)
    .then(ctx => {
      // TODO: Human Check
      // Check and see if this address has stamps
      return ctx
    })
    .then(vouch) // write a vouch Transaction
    .then(dao) // update the VouchDAO Contract
    .then(res.json.bind(res))
    .catch(err => res.status(400).json(err))
}



