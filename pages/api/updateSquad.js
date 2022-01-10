import { withMongo } from "../../libs/mongo";

const handler = async (req, res) => {
  console.log("running updateSquad", req.body.dateId);
  try {
    const dateId = parseInt(req.body.dateId);
    const squad = req.body.squad ? req.body.squad : [];
    const season = req.body.season;

    if (dateId && squad) {
      // update the dateResults
      if (global.fbAdminApp === null) global.fbAdminApp = admin.initializeApp();

      let resp = await req.db
        .collection("dates")
        .updateOne({ dateId }, { $set: { squad } });
      console.log("resp modified", resp.modifiedCount);

      res.json({ message: "aok", resp });
    } else res.json({ message: "not good data" });
  } catch (e) {
    console.log("catch error", e);
  }
};

export default withMongo(handler);
