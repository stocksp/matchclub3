import clientPromise from "libs/mongo"
import { getSeason, startOfSeason } from "./utils";
import type { NextApiRequest, NextApiResponse } from "next"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    console.log("starting getDates");
    const client = await clientPromise
    const db = client.db()
    const docs = await db
      .collection("dates")
/*       .find({ season: getSeason() }) */
      .find({season: {$gte:(getSeason())}})
      .project({ squad: 0, _id: 0 })
      .sort({ date: -1 })
      .toArray();
    //console.log("found dates", docs.length);
    return {message: "ok", docs};
  } catch (error) {
    return error;
  }
};

export default handler
