import clientPromise from "libs/mongo"
import type { NextApiRequest, NextApiResponse } from "next"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    console.log("starting getClubsLocations:")
    const client = await clientPromise
    const db = client.db()

    const clubs = await db
      .collection("clubs")
      .find({})
      .project({ _id: 0 })
      .sort({ name: 1 })
      .toArray()

    const locations = await db
      .collection("locations")
      .find({})
      .project({ _id: 0 })
      .sort({ name: 1 })
      .toArray()

    console.log("founda clubs and locations", clubs.length, locations.length)
    return { message: "ok", clubs, locations }
  } catch (error) {
    res.json("Error: " + error.toString())
  }
}
export default handler
