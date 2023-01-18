import { magic } from "libs/magic";
import Iron from "@hapi/iron";
import clientPromise from "libs/mongo"
import { setTokenCookie } from "libs/auth-cookies";

import type { NextApiRequest, NextApiResponse } from "next"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  console.log("starting api/login");
  if (req.method !== "POST") return res.status(405).end();
  const email = req.body.email;

  try {
    const client = await clientPromise
    const db = client.db()
    const doc = await db
      .collection("members")
      .findOne({ email: email, active: true, guest: false });
    if (!doc) {
      console.log(`Didn't find user from magic`);
      res.status(403).json({ done: false });
      return;
    }
    // exchange the DID from Magic for some user data
    const did = magic.utils.parseAuthorizationHeader(req.headers.authorization);
    const user = await magic.users.getMetadataByToken(did);
    //console.log('magic', process.env.MAGIC_SECRET_KEY);

    console.log("found user");
    const bowler = {...user, alias: doc.alias, memberId: doc.memberId, role: doc.role ? doc.role : ""}
    // user.alias = doc.alias;
    // user.memberId = doc.memberId;
    // user.role = doc.role ? doc.role : "";

    // Author a couple of cookies to persist a users session
    // Author a couple of cookies to persist a user's session
    const token = await Iron.seal(
      bowler,
      process.env.ENCRYPTION_SECRET,
      Iron.defaults
    );
    setTokenCookie(res, token);

    res.status(200).send({ done: true, user });
  } catch (error) {
    console.log("login error", error.message);
    res.status(error.status || 500).end(error.message);
  }
};

export default handler
