import { withMongo } from "./mongo";

const handler = async (req, res) => {
  try {
    console.log("starting getSquads");
    const now = new Date();
    //set now time to 0 hours to allow squad changes for entire match day
    now.setHours(0);
    now.setMinutes(0);
    const docs = await req.db
      .collection("dates")
      .find({ date: { $gte: now } })
      .sort({ date: 1 })
      .project({ _id: 0 })
      .toArray();

    console.log("found squads", docs.length);
    return { message: "ok", docs };
  } catch (error) {
    res.json("Error: " + error.toString());
  }
};
export default withMongo(handler);
