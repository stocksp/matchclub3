import { Magic } from "@magic-sdk/admin";
import Iron from "@hapi/iron";
import CookieService from "libs/cookie";
import { withMongo } from "libs/mongo";

let magic = new Magic(process.env.MAGIC_SECRET_KEY);

const handler = async (req, res) => {
  if (req.method !== "POST") return res.status(405).end();

  try {
    // exchange the DID from Magic for some user data
    const did = magic.utils.parseAuthorizationHeader(req.headers.authorization);
    const user = await magic.users.getMetadataByToken(did);

    const doc = await req.db
      .collection("members")
      .findOne({ email: user.email });
    if (doc) {
      user.alias = doc.alias;
      user.memberId = doc.memberId;
      user.role = doc.role ? doc.role : "";
    }

    // Author a couple of cookies to persist a users session
    // Author a couple of cookies to persist a user's session
    const token = await Iron.seal(
      user,
      process.env.ENCRYPTION_SECRET,
      Iron.defaults
    );
    CookieService.setTokenCookie(res, token);

    res.status(200).send({ done: true });
  } catch (error) {
    console.log("login error", error.message);
    res.status(error.status || 500).end(error.message);
  }
};

export default withMongo(handler);
