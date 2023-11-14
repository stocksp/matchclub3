import getDates from "libs/getDates"
import getAllMembers from "libs/getAllMembers"
import getMatchStats from "libs/getMatchStats"
import getTeamStats from "libs/getTeamStats"
import getSquad from "libs/getSquad"
import getMemberData from "libs/getMemberData"
import getSquads from "libs/getSquads"
import getClubsLocations from "libs/getClubsLocations"
import getHighScores from "libs/getHighScores"
import testMail from "libs/testMail"
import emailExists from "libs/emailExists"
import getBests from "libs/getBests"
import userInSquad from "libs/userInSquad"

import type { NextApiRequest, NextApiResponse } from "next"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const name = req.query.name
  console.log("starting getData:", name)
  try {
    if (name === "getBests") {
      const data = await getBests(req, res)
      if (data.message == "ok") res.json(data.docs)
      else res.json("Error: " + data.toString())
    } else if (name === "getDates") {
      const data = await getDates(req, res)
      if (data.message == "ok") res.json(data.docs)
      else res.json("Error: " + data.toString())
    } else if (name === "getAllMembers") {
      const data = await getAllMembers(req, res)
      if (data.message == "ok") res.json(data.docs)
      else res.json("Error: " + data.toString())
    } else if (name === "getMatchStats") {
      const data = await getMatchStats(req, res)
      if (data.length === 2) res.json(data)
      else res.json("Error: " + data.toString())
    } else if (name === "getTeamStats") {
      const data = await getTeamStats(req, res)
      if (data.message == "ok") res.json(data.docs)
      else res.json("Error: " + data.toString())
    } else if (name === "getSquad") {
      const data = await getSquad(req, res)
      if (data.message == "ok") res.json(data.doc)
      else res.json("Error: " + data.toString())
    } else if (name === "getMemberData") {
      const data = await getMemberData(req, res)
      if (data.message == "ok") res.json(data.doc)
      else res.json("Error: " + data.toString())
    } else if (name === "getSquads") {
      const data = await getSquads(req, res)
      if (data.message == "ok") res.json(data.docs)
      else res.json("Error: " + data.toString())
    } else if (name === "getClubsLocations") {
      const data = await getClubsLocations(req, res)
      if (data.message == "ok") res.json({ clubs: data.clubs, locations: data.locations })
      else res.json("Error: " + data.toString())
    } else if (name === "getHighScores") {
      const data = await getHighScores(req, res)
      if (data.message == "ok") {
        res.json({ results: data.results, dateResults: data.dateResults })
      } else res.json("Error: " + data.toString())
    } else if (name === "testMail") {
      const data = await testMail(req, res)
      if (data.message == "ok") {
        res.json({ results: data.results })
      } else res.json("Error: " + data.toString())
    } else if (name === "emailExists") {
      const data = await emailExists(req, res)
      res.json({ member: data.member })
    } else if (name === "userInSquad") {
      const data = await userInSquad(req, res)
      res.json({ data })
    } else {
      console.log("Bad name no go")
      res.json("Error: bad query name")
    }
  } catch (error) {
    console.log("error thrown in getData", error)
  }
}

export default handler
