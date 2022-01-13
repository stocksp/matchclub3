import { date } from "yup";
import { withMongo } from "../../libs/mongo";

const { format } = require("date-fns");
const handler = async (req, res) => {
  console.log(
    "running removeBowlerFromSquad",
    req.body.dateId,
    req.body.bowlerId
  );
  try {
    const dateId = parseInt(req.body.dateId);
    const bowlerId = parseInt(req.body.bowlerId);
    const bowler = await req.db
      .collection("members")
      .findOne({ memberId: bowlerId });
    const dateData = await req.db
      .collection("dates")
      .findOne({ dateId: dateId });
    

    if (dateId && bowlerId) {
      // get the squad with requested dateId
      // squad is an object with squad property with our array
      const squad = await req.db
        .collection("dates")
        .findOne({ dateId }, { projection: { squad: 1, _id: 0 } });
      let theSquad = squad.squad;

      // remove the one element
      theSquad = theSquad.filter((e) => e.id !== bowlerId);
      //sort it just to be safe
      theSquad.sort((a, b) => a.pos - b.pos);
      // remap the pos to remove the hole if its not on the end
      theSquad = theSquad.map((b, i) => {
        return { ...b, pos: i + 1 };
      });

      // now add it
      let result = await req.db
        .collection("dates")
        .updateOne({ dateId }, { $set: { squad: theSquad } });

      res.json({ message: "aok", result: result.modifiedCount });

      result = await req.db
        .collection("signups")
        .insertOne({
          name: bowler.alias,
          date: dateData.date,
          location: dateData.location,
          what: "remove",
          when: new Date(),
          emailSent: false,
        });

      // resp = await nodemailerMailgun.sendMail({
      //   from: "admin@cornerpins.com",
      //   to: ["fireater1959@gmail.com", "cap.stocks@gmail.com"], // An array if you have multiple recipients.
      //   subject: `MatchClub Dropout`,
      //   "h:Reply-To": "fireater1959@gmail.com",
      //   html: `<html>
      //    <p>${bowler.alias} dropped out of the ${format(
      //     dateData.date,
      //     "MM/dd/yyyy"
      //   )} match at ${dateData.location}.</p>
      //   <p>This was done at ${format(dateLocal, "h:mma MM/dd/yyyy")}.</p>
      //    </html>`,
      // });
    } else {
      res.json({ message: "no update!" });
    }
  } catch (e) {
    console.log("catch error", e);
  }
};

export default withMongo(handler);
