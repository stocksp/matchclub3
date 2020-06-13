import { withMongo } from "../../libs/mongo";
import { adminInit } from "../../libs/firebaseAdmin";

const handler = async (req, res) => {
  console.log("running changePW", req.body.email);
  try {
    const email = req.body.email;
    const pw = req.body.pw;
    if (email && pw) {
      // update the dateResults
      if (!global.fbAdminApp) {
        global.fbAdminApp = adminInit();
      }

      try {
        const userRecord = await global.fbAdminApp.auth().getUserByEmail(email);
        console.log("Successfully fetched user data:", userRecord.toJSON());
        if (userRecord.uid) {
          global.fbAdminApp.auth().updateUser(userRecord.uid, {
            password: pw,
          });
          console.log("updated user pw:", userRecord.toJSON());
          res.json({ message: "aok" });
        } else {
          res.json({message: "email not found"})
        }
      } catch (e) {
        console.log("failed to add new auth user", e);
      }
    } else res.json({ message: "not good data" });
  } catch (e) {
    console.log("catch error", e);
  }
};

export default withMongo(handler);
