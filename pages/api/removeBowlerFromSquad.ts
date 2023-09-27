import clientPromise from "libs/mongo"

const { format } = require("date-fns");
import type { NextApiRequest, NextApiResponse } from "next"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  console.log(
    "running removeBowlerFromSquad",
    req.body.dateId,
    req.body.bowlerId
  );
  try {
    const client = await clientPromise
    const db = client.db()
    const dateId = parseInt(req.body.dateId);
    const bowlerId = parseInt(req.body.bowlerId);
    const bowler = await db
      .collection("members")
      .findOne({ memberId: bowlerId });
    const dateData = await db
      .collection("dates")
      .findOne({ dateId: dateId });
    

    if (dateId && bowlerId) {
      
      let theSquad = dateData.squad;

      // remove the one element
      theSquad = theSquad.filter((e) => e.id !== bowlerId);
      //sort it just to be safe
      theSquad.sort((a, b) => a.pos - b.pos);
      // remap the pos to remove the hole if its not on the end
      theSquad = theSquad.map((b, i) => {
        return { ...b, pos: i + 1 };
      });

      // now add it
      let result = await db
        .collection("dates")
        .updateOne({ dateId }, { $set: { squad: theSquad } });
// why are we returning here instead of after the next db call??
      res.json({ message: "aok", result: result.modifiedCount });

      let result2 = await db
        .collection("signups")
        .insertOne({
          name: bowler.alias,
          date: dateData.date,
          location: dateData.location,
          what: "remove",
          when: new Date(),
          emailSent: false,
        });

    } else {
      res.json({ message: "no update!" });
    }
  } catch (e) {
    console.log("catch error", e);
  }
};

export default handler
