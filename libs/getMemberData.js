import { withMongo } from "./mongo";

const handler = async (req, res) => {
  try {
    const id = req.query.id;
    console.log("starting getMemberData:", id);
    const doc = await req.db
      .collection("members")
      .findOne({ memberId: parseInt(id) });

    console.log("found member", doc.alias);
    return { message: "ok", doc };
  } catch (error) {
    return error;
  }
};
export default withMongo(handler);
