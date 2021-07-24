import { magic } from "libs/magic";
import Iron from "@hapi/iron";
import { withMongo } from "libs/mongo";
import { setTokenCookie } from "libs/auth-cookies";

const handler = async (req, res) => {
  console.log("starting api/login");
  if (req.method !== "POST") return res.status(405).end();
  const email = req.body.email;

  try {
    const doc = await req.db
      .collection("members")
      .findOne({ email: email, active: true, guest: false });
    if (!doc) {
      console.log(`Didn't find user from magic`);
      res.status(403).json({ done: false });
      return;
    }
    // exchange the DID from Magic for some user data
    const did = magic.utils.parseAuthorizationHeader(req.headers.authorization);
    const user = await magic.users.getMetadataByToken(did);
    //console.log('magic', process.env.MAGIC_SECRET_KEY);

    console.log("found user");
    user.alias = doc.alias;
    user.memberId = doc.memberId;
    user.role = doc.role ? doc.role : "";

    // Author a couple of cookies to persist a users session
    // Author a couple of cookies to persist a user's session
    const token = await Iron.seal(
      user,
      process.env.ENCRYPTION_SECRET,
      Iron.defaults
    );
    setTokenCookie(res, token);

    res.status(200).send({ done: true, user });
  } catch (error) {
    console.log("login error", error.message);
    res.status(error.status || 500).end(error.message);
  }
};

export default withMongo(handler);
