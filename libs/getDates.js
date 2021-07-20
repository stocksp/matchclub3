import { withMongo } from "./mongo";
import { getSeason, startOfSeason } from "./utils";

const handler = async (req, res) => {
  try {
    console.log("starting getDates");
    const docs = await req.db
      .collection("dates")
      .find({ season: getSeason() })
      .project({ squad: 0, _id: 0 })
      .sort({ date: -1 })
      .toArray();
    console.log("found dates", docs.length);
    return {message: "ok", docs};
  } catch (error) {
    return error;
    //res.json("Error: " + error.toString());
  }

  // TODO - Update state in mongo to persist
  //res.json(state);
};

export default withMongo(handler);
