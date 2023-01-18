import clientPromise from "libs/mongo"

import { getSeason, startOfSeason } from "libs/utils";
import type { NextApiRequest, NextApiResponse } from "next"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    console.log("starting getScores");
    const client = await clientPromise
    const db = client.db()

    const wonLost = await db
      .collection("dateResults")
      .find({ season: getSeason() })
      .toArray();

    const squads = await db

      .collection("dates")
      .find({ season: getSeason(), date: { $lte: new Date() } })
      .project({ squad: 1, dateId: 1, _id: 0 })
      .sort({ date: -1 })
      .toArray();

    const scores = await db

      .collection("matchScores")
      .find({ season: getSeason() })
      .project({ _id: 0 })
      .sort({ date: -1 })
      .toArray();

    squads.forEach((squad) => {
      const theScores = scores.filter((s) => s.dateId === squad.dateId);
      if (theScores.length > 0) {
        squad.squad.forEach((bowler) => {
          const theGames = theScores.find((s) => s.memberId === bowler.id);
          // if they bowled and have scores
          if (theGames) bowler.games = theGames.games;
          else bowler.games = [0, 0, 0];
        });
      } else {
        squad.squad.forEach((s) => {
          s.games = [0, 0, 0];
        });
      }
      // add the won lost if we have it
      const theWins = wonLost.find((w) => w.dateId === squad.dateId);
      if (theWins) {
        squad.won = theWins.won;
        squad.lost = theWins.lost;
      } else {
        squad.won = 0;
        squad.lost = 0;
      }
    });
    console.log("found squads", squads.length);
    res.json(squads);
  } catch (error) {
    res.json("Error: " + error.toString());
  }
};

export default handler
