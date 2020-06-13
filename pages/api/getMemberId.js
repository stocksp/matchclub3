import { withMongo } from "../../libs/mongo";

const handler = async (req, res) => {
  try {
    console.log("starting getMemberId:", req.query.email);

    const member = await req.db
      .collection("members")
      .findOne({ email: req.query.email });

    console.log("found member", member?.alias);
    if (member)
      res.json({ id: member.memberId, alias: member.alias, role: member.role },
      );
   
  } catch (error) {
    res.json("Error getting member: " + error.toString());
  }
};
export default withMongo(handler);
