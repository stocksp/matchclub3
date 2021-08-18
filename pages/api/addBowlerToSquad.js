import { withMongo } from "../../libs/mongo";
import { utcToZonedTime } from "date-fns-tz";
import { array } from "yup";
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
    "running addBowlerToSquad",
    req.body.dateId,
    req.body.bowlerId,
    req.body.name
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
    const dateLocal = utcToZonedTime(new Date(), "America/Los_Angeles");
    const name = req.body.name;

    if (dateId && bowlerId && name) {
      // get the squad with requested dateId
      // squad is an object with squad property with our array
      const squad = await req.db
        .collection("dates")
        .findOne({ dateId }, { projection: { squad: 1, _id: 0 } });
      const theSquad = squad.squad;
      //sort it just to be safe
      theSquad.sort((a, b) => a.pos - b.pos);
      //add new one
      theSquad.push({ name, pos: squad.squad.length + 1, id: bowlerId });
      //console.log("squad", squad.squad);
      // now add it
      const result = await req.db
        .collection("dates")
        .updateOne({ dateId }, { $set: { squad: theSquad } });

      res.json({ message: "aok", result: result.result.nModified });
      resp = await nodemailerMailgun.sendMail({
        from: "admin@cornerpins.com",
        to: ["rstocks1@comcast.net", "cap.stocks@gmail.com"], // An array if you have multiple recipients.
        subject: `MatchClub Signup`,
        "h:Reply-To": "fireater1959@gmail.com",
        html: `<html>
         <p>${bowler.alias} signed up for the ${format(
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
