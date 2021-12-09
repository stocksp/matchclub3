import { withMongo } from "./mongo";

const handler = async (req, res) => {
  try {
    const email = decodeURIComponent(req.query.email)
    console.log("starting emailExists:", email);

    const member = await req.db
      .collection("members")
      .findOne({ email: email });

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
