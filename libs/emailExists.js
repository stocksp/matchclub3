import { withMongo } from "./mongo";

const handler = async (req, res) => {
  try {
    console.log("starting emailExists:", req.query.email);

    const member = await req.db
      .collection("members")
      .findOne({ email: req.query.email });

    console.log("found member", member?.alias);
    if (member)
      return {
        member: true,
        memberId: member.memberId,
        alias: member.alias,
        role: member.role,
      };
    else return { member: false };
  } catch (error) {
    return error;
  }
};
export default withMongo(handler);
