import { withMongo } from "./mongo";

const handler = async (req, res) => {
  try {
    console.log("starting getSquad:", req.query.dateId);
    const docs = await req.db

      .collection("dates")
      .find({ dateId: parseInt(req.query.dateId), season: req.query.season })
      .project({ squad: 1, _id: 0 })
      .toArray();

    console.log("founda doc", docs[0]);
    return { message: "ok", doc: docs[0] };
  } catch (error) {
    res.json("Error: " + error.toString());
  }
};
export default withMongo(handler);
