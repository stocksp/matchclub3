import { withMongo } from "libs/mongo";
import moment from "moment";

const handler = async (req, res) => {
  console.log("running updateDate", req.body.dateId);
  try {
    const dateId = parseInt(req.body.dateId);
    const host = req.body.host;
    const guest = req.body.guest;
    const location = req.body.location;
    const teamsizemax = parseInt(req.body.teamsizemax);
    const date = new Date(req.body.date);
    const hasmeeting = req.body.hasmeeting;
    const season = req.body.season;

    if (
      season &&
      dateId &&
      host &&
      guest &&
      location &&
      !isNaN(teamsizemax) &&
      moment(date).isValid()
    ) {
      let resp = await req.db.collection("dates").updateOne(
        { dateId },
        {
          $set: {
            host,
            guest,
            location,
            teamsizemax,
            date,
            hasmeeting,
            season,
          },
        },
        {
          upsert: true,
        }
      );
      console.log("resp", resp.result.nModified);
      return({ message: "aok", resp });
    } else return error;
  } catch (e) {
    console.log("catch error", e);
  }
};

export default withMongo(handler);
