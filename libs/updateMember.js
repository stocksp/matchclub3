import { withMongo } from "libs/mongo";

const handler = async (req, res) => {
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
  );
  try {
    const memberId = parseInt(req.body.memberId);
    const guest = req.body.guest;
    const alias = req.body.alias;
    const active = req.body.active;
    const email = req.body.email;
    const first = req.body.first;
    const last = req.body.last;
    const address = req.body.address;
    const city = req.body.city;
    const state = req.body.state;
    const zip = req.body.zip;
    const phone = req.body.phone;
    const cell = req.body.cell;
    const reminders = req.body.reminders;
    const upsert = req.body.upsert;

    const data = { alias, active, guest };
    if (email && upsert) data.email = email;
    if (first) data.first = first;
    if (last) data.last = last;
    if (address) data.address = address;
    if (city) data.city = city;
    if (state) data.state = state;
    if (zip) data.zip = zip;
    if (phone) data.phone = phone;
    if (cell) data.cell = cell;
    if (reminders) data.reminders = reminders.map(r => parseInt(r));

    if (memberId) {
      
      let resp = await req.db
        .collection("members")
        .updateOne(
          { memberId },
          { $set: data },
          {
            upsert: upsert
          }
        );
      console.log(
        "resp modified",
        resp.modifiedCount,
        "upserted",
        resp.upsertedCount === 1 ? true : false
      );
      
      return({ message: "aok",  resp});
    } else return({ message: "not good data" });
  } catch (e) {
    console.log("catch error", e);
  }
};

export default withMongo(handler);
