import clientPromise from "libs/mongo"
import type { NextApiRequest, NextApiResponse } from "next"

type theData = {
  email?: string
  first?: string
  last?: string
  address?: number
  city?: string
  state?: string
  zip?: string
  phone?: string
  cell?: string
  active: boolean
  memberid?: string
  guest: boolean
  reminders?: number[]
  alias: string
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  console.log(
    "running updateMember",
    req.body.memberId,
    req.body.alias,
    req.body.guest,
    req.body.email,
    req.body.first,
    req.body.last,
    req.body.address,
    req.body.city,
    req.body.state,
    req.body.zip,
    req.body.phone,
    req.body.cell,
    req.body.active
  )
  try {
    const client = await clientPromise
    const db = client.db()
    const memberId = parseInt(req.body.memberId)
    const guest = req.body.guest as boolean
    const alias = req.body.alias as string
    const active = req.body.active as boolean
    const email = req.body.email as string
    const first = req.body.first as string
    const last = req.body.last as string
    const address = req.body.address
    const city = req.body.city
    const state = req.body.state
    const zip = req.body.zip
    const phone = req.body.phone
    const cell = req.body.cell
    const reminders = req.body.reminders as string[]
    const upsert = req.body.upsert

    const data: theData = { alias, active, guest }
    if (email) data.email = email
    if (first) data.first = first
    if (last) data.last = last
    if (address) data.address = address
    if (city) data.city = city
    if (state) data.state = state
    if (zip) data.zip = zip
    if (phone) data.phone = phone
    if (cell) data.cell = cell
    if (reminders) data.reminders = reminders.map((r) => parseInt(r))

    if (memberId) {
      let resp = await db.collection("members").updateOne(
        { memberId },
        { $set: data },
        {
          upsert: upsert,
        }
      )
      console.log(
        "resp modified",
        resp.modifiedCount,
        "upserted",
        resp.upsertedCount === 1 ? true : false
      )

      return { message: "aok", resp }
    } else return { message: "not good data" }
  } catch (e) {
    console.log("catch error", e)
  }
}

export default handler
