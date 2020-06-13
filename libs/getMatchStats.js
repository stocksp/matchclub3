import { withMongo } from "./mongo";

import { getSeason, startOfSeason } from "./utils";

const handler = async (req, res) => {
  try {
    console.log("starting getMatchStats");

    const handis = await req.db
      .collection("handicaps")
      .findOne({ season: getSeason() });

    const dateResults = await req.db
      .collection("dateResults")
      .find({ season: getSeason() })
      .project({ _id: 0, match: 0, season: 0 })
      .toArray();

    const didNotBowl = dateResults
      .filter((r) => r.won === null)
      .map((r) => r.dateId);

    const docs = await req.db
      .collection("matchScores")
      .find({ date: { $gte: startOfSeason() }, dateId: { $nin: didNotBowl } })
      .project({ _id: 0 })
      .sort({ date: -1 })
      .toArray();

    docs.forEach((e) => {
      const param = `${e.dateId.toString()}-${e.memberId.toString()}`;
      e.handi = handis[param];
      e.game1 = e.games[0];
      e.game2 = e.games[1];
      e.game3 = e.games[2];
      e.series = e.games.reduce((a, b) => a + b);
      e.hiGame = Math.max(...e.games);
      e.hiGameHandi = Math.max(...e.games) + handis[param];
      e.seriesHandi = e.games.reduce((a, b) => a + b) + handis[param];
      e.average = Math.floor(e.series / e.games.length);
    });
    console.log("found", docs.length);
    return [docs, dateResults];
  } catch (error) {
    //res.json("Error: " + error.toString());
    return error;
  }
};

export default withMongo(handler);
