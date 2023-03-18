import { parseISO } from "date-fns"
import clientPromise from "libs/mongo"
import {
  makeHandi,
  getSeason,
  calcStats,
  makeHighScores,
  computePersonalBest,
} from "../../libs/utils"

import type { NextApiRequest, NextApiResponse } from "next"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  console.log(
    "running updateScores",
    req.body.dateId,
    req.body.match,
    req.body.scores,
    req.body.won,
    req.body.lost,
    req.body.season
  )
  try {
    const client = await clientPromise
    const db = client.db()
    const dateId = parseInt(req.body.dateId)
    const match = req.body.match
    let scores = req.body.scores
    const won = parseInt(req.body.won)
    const lost = parseInt(req.body.lost)
    const season = req.body.season
    console.log("scores", scores)

    if (dateId && match && scores && !isNaN(won) && !isNaN(lost)) {
      // update the dateResults

      let resp = await db
        .collection("dateResults")
        .updateOne({ dateId }, { $set: { dateId, won, lost, match, season } }, { upsert: true })
      console.log("won lost ok", resp.acknowledged)
      // delete all old scores for this date
      let resp2 = await db.collection("matchScores").deleteMany({ dateId })
      console.log("delete old scores ok", resp.acknowledged)
      // insert the new ones
      // first convert the data from JSON strings to ints and date
      // then make it an array
      const keys = Object.keys(scores)
      const scoreArray = []
      keys.forEach((k) => {
        scores[k].date = parseISO(scores[k].date)
        scores[k].memberId = parseInt(scores[k].memberId)
        scores[k].dateId = parseInt(scores[k].dateId)
        scores[k].games = scores[k].games.map((g) => parseInt(g))
        scoreArray.push(scores[k])
      })
      // now insert them
      let resp3 = await db.collection("matchScores").insertMany(scoreArray)
      console.log("inserting new scores ok", resp.acknowledged)
      // rebuild update and return the handicaps for all bowlers
      const handi = await makeHandi(db)
      console.log("handi", handi)

      const theDate = scoreArray[0].date

      // get ALL the scores for this season
      const docs = await db
        .collection("matchScores")
        .find({ season: season })
        .sort({ date: 1 })
        .project({ _id: 0 })
        .toArray()
      // ids for all the members who have bowled
      // TODO shouldn't we just filter the above docs
      // and make theIds instead of another trip to the db??
      const theIds = await db.collection("matchScores").distinct("memberId", { season: season })

      console.log("ids", theIds)

      let bulkWrites = []
      let bulkWritesPersonal = []
      theIds.forEach((id) => {
        const theScores = docs.filter((d) => d.memberId === id) as Array<Score>
        if (theScores.length === 0) console.log(`NO SCORES FOUND for memberId: ${id}`)
        else {
          const stats: MemberStat = calcStats(theScores)
          console.log("stats", stats)
          bulkWrites.push({
            updateOne: {
              filter: { memberId: id },
              update: { $set: stats },
              upsert: true,
            },
          })
          //most improved if they bowled this match and a previous match
          // if (
          //   theScores.find((d) => d.date < theDate) &&
          //   theScores.find((s) => s.memberId === id && s.dateId === dateId)
          // ) {
          //   // they have bowled more than this match so
          //   const previousScores = theScores.filter((d: Score) => d.dateId !== dateId)
          //   bulkWritesPersonal = bulkWritesPersonal.concat(
          //     computePersonalBest(previousScores, stats, dateId)
          //   )
          // }
        }
      })

      await db.collection("memberstats").bulkWrite(bulkWrites)
      // if (bulkWritesPersonal.length > 0)
      //   await db.collection("improvements").bulkWrite(bulkWritesPersonal)

      // now do the highScores for this date
      const theScores = makeHighScores(scoreArray, handi)
      let resp5 = await db.collection("highScores").updateOne(
        { dateId },
        { $set: { data: theScores, season } },
        {
          upsert: true,
        }
      )
      console.log("resp", resp.modifiedCount)

      res.json({ message: "aok" })
    } else res.json({ message: "not good" })
  } catch (e) {
    console.log("catch error", e)
    res.json({ message: "not good" })
  }
}

export default handler
