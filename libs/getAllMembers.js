import { withMongo } from "./mongo";


const handler = async (req, res) => {
  try {
    console.log("starting getAllMembers");
    const docs = await req.db
    .collection("members")
    .find({})
    .project({ _id: 0 })
    .toArray();
  console.log("found", docs.length);
  return {message: "ok", docs};
  } catch (error) {
    return error
  }
};

export default withMongo(handler);
