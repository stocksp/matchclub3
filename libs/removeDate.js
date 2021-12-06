import { withMongo } from "libs/mongo";

const handler = async (req, res) => {
  console.log("running removeDate", req.body.dateId);
  try {
    const dateId = parseInt(req.body.dateId);

    if (dateId) {
      let resp = await req.db.collection("dates").removeOne({ dateId });
      console.log("resp", resp.modifiedCount);
      return { message: "aok", resp };
    } else return error;
  } catch (e) {
    console.log("catch error", e);
  }
};

export default withMongo(handler);
