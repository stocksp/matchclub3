import { withMongo } from "./mongo";
import { utcToZonedTime } from "date-fns-tz";
const { format } = require("date-fns");

const handler = async (req, res) => {
  const now = new Date();
  const date = utcToZonedTime(now, "America/Los_Angeles");
  console.log(`${format(now, "MMMM d yyyy")} at ${format(now, "hh:mm a")}`);
  console.log(`${format(date, "MMMM d yyyy")} at ${format(date, "hh:mm a")}`);
  try {
    console.log("starting testMail");
    const resp = await req.db
        .collection("testing")
        .insertOne({
          now,
          date
        });
    
    return { message: "ok", resp };
  } catch (error) {
    console.log("testMail exception", error);
    return error;
  }
};

export default withMongo(handler);
