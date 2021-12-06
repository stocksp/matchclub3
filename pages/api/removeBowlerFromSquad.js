import { date } from "yup";
import { withMongo } from "../../libs/mongo";
import { utcToZonedTime } from "date-fns-tz";
const { format } = require("date-fns");
const nodemailer = require("nodemailer");
const mg = require("nodemailer-mailgun-transport");
let resp = null;
const api_key = process.env.EMAIL_API_KEY;
const domain = process.env.EMAIL_DOMAIN;
const auth = {
  auth: {
    api_key: api_key,
    domain: domain,
  },
};
const nodemailerMailgun = nodemailer.createTransport(mg(auth));
const handler = async (req, res) => {
  console.log(
    "running removeBowlerFromSquad",
    req.body.dateId,
    req.body.bowlerId
  );
  try {
    const dateId = parseInt(req.body.dateId);
    const bowlerId = parseInt(req.body.bowlerId);
    const season = req.body.season;
    const bowler = await req.db
      .collection("members")
      .findOne({ memberId: bowlerId });
    const dateData = await req.db
      .collection("dates")
      .findOne({ dateId: dateId, season, season });
    const dateLocal = utcToZonedTime(new Date(), "America/Los_Angeles");

    if (dateId && bowlerId) {
      // get the squad with requested dateId
      // squad is an object with squad property with our array
      const squad = await req.db
        .collection("dates")
        .findOne({ dateId, season }, { projection: { squad: 1, _id: 0 } });
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
      const result = await req.db
        .collection("dates")
        .updateOne({ dateId , season}, { $set: { squad: theSquad } });

      res.json({ message: "aok", result: result.modifiedCount });

      resp = await nodemailerMailgun.sendMail({
        from: "admin@cornerpins.com",
        to: ["fireater1959@gmail.com", "cap.stocks@gmail.com"], // An array if you have multiple recipients.
        subject: `MatchClub Dropout`,
        "h:Reply-To": "fireater1959@gmail.com",
        html: `<html>
         <p>${bowler.alias} dropped out of the ${format(
          dateData.date,
          "MM/dd/yyyy"
        )} match at ${dateData.location}.</p>
        <p>This was done at ${format(dateLocal, "h:mma MM/dd/yyyy")}.</p>
         </html>`,
      });
    } else {
      res.json({ message: "no update!" });
    }
  } catch (e) {
    console.log("catch error", e);
  }
};

export default withMongo(handler);
