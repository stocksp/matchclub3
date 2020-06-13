import { withMongo } from "./mongo";


const handler = async (req, res) => {
  try {
    console.log("starting getTeamStats");
    const docs = await req.db
    .collection("memberstats")
    .find({})
    .project({ _id: 0 })
    .sort({ average: -1 })
    .toArray();
    console.log("found", docs.length);
    return {message: "ok", docs};
  } catch (error) {
    return error
  }

};

export default withMongo(handler);
