import moment from "moment/moment";
import { withMongo } from "../../libs/mongo";
import {
  makeHandi,
  getSeason,
  calcStats,
  makeHighScores,
} from "../../libs/utils";


const handler = async (req, res) => {
  console.log(
    "running updateScores",
    req.body.dateId,
    req.body.match,
    req.body.scores,
    req.body.won,
    req.body.lost,
    req.body.season
  );
  try {
    const dateId = parseInt(req.body.dateId);
    const match = req.body.match;
    let scores = req.body.scores;
    const won = parseInt(req.body.won);
    const lost = parseInt(req.body.lost);
    const season = req.body.season;
    console.log("scores", scores);

    if (dateId && match && scores && !isNaN(won) && !isNaN(lost)) {
      // update the dateResults

      let resp = await req.db
        .collection("dateResults")
        .updateOne(
          { dateId },
          { $set: { dateId, won, lost, match, season } },
          { upsert: true }
        );
      console.log("won lost ok", resp.result.ok);
      // delete all old scores for this date
      resp = await req.db.collection("matchScores").deleteMany({ dateId });
      console.log("delete old scores ok", resp.result.ok);
      // insert the new ones
      // first convert the data from JSON strings to ints and date
      // then make it an array
      const keys = Object.keys(scores);
      const scoreArray = [];
      keys.forEach((k) => {
        scores[k].date = moment(scores[k].date).toDate();
        scores[k].memberId = parseInt(scores[k].memberId);
        scores[k].dateId = parseInt(scores[k].dateId);
        scores[k].games = scores[k].games.map((g) => parseInt(g));
        scoreArray.push(scores[k]);
      });
      // now insert them
      resp = await req.db.collection("matchScores").insertMany(scoreArray);
      console.log("inserting new scores ok", resp.result.ok);
      // rebuild update and return the handicaps for all bowlers
      const handi = await makeHandi(req.db);
      console.log("handi", handi);
      // make memberStats

      // get ALL the scores for this seaon
      const docs = await req.db
        .collection("matchScores")
        .find({ season: getSeason() })
        .sort({ date: 1 })
        .project({ _id: 0 })
        .toArray();
      // ids for all the members who have bowled
      const theIds = await req.db

        .collection("matchScores")
        .distinct("memberId", { season: getSeason() });

      console.log("ids", theIds);

      let bulkWrites = [];
      theIds.forEach((id) => {
        const theScores = docs.filter((d) => d.memberId === id);
        if (theScores.lenght === 0)
          console.log(`NO SCORES FOUND for memberId: ${id}`);
        else {
          const stats = calcStats(theScores, handi);
          stats.member = theScores[0].alias;
          stats.memberId = id;
          console.log("stats", stats);
          bulkWrites.push({
            updateOne: {
              filter: { memberId: id },
              update: stats,
              upsert: true,
            },
          });
        }
      });
      resp = await req.db.collection("memberstats").bulkWrite(bulkWrites);

      // now do the highScores for this date
      const theScores = makeHighScores(scoreArray, handi);
      resp = await req.db.collection("highScores").updateOne(
        { dateId },
        { $set: { data: theScores, season } },
        {
          upsert: true,
        }
      );
      console.log("resp", resp.result.nModified);

      res.json({ message: "aok"});
    } else res.json({ message: "not good" });
  } catch (e) {
    console.log("catch error", e);
  }
};

export default withMongo(handler);
