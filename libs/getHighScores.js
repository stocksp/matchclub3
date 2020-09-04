import { withMongo } from "./mongo";
import { getSeason } from "./utils";

const handler = async (req, res) => {
  try {
    console.log("starting getHighScores");
    const dateResults = await req.db
    .collection("dateResults")
      .find({ season: getSeason() })
      .project({ _id: 0, match: 0, season: 0 })
      .toArray();

    const docs = await req.db
      .collection("highScores")
      .find({ season: getSeason() })
      .project({ _id: 0 })
       .toArray();
    console.log("found", docs.length);
    return ({ message: "ok", results: docs, dateResults });
  } catch (error) {
    return error;
    //res.json("Error: " + error.toString());
  }

  // TODO - Update state in mongo to persist
  //res.json(state);
};

export default withMongo(handler);
