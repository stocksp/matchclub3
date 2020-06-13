import { withMongo } from "./mongo";

const handler = async (req, res) => {
  try {
    console.log("starting getSquads");
    const now = new Date();
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
