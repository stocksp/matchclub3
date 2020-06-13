import { withMongo } from "libs/mongo";
const handler = async (req, res) => {
  console.log("running updateLocation");
  try {
    const locationId = parseInt(req.body.locationId);
    const name = req.body.name;
    const address = req.body.address;
    const city = req.body.city;
    const state = req.body.state;
    const zip = req.body.zip;
    const phone = req.body.phone;

    if (
      locationId &&
      name &&
      address &&
      city &&
      state &&
      zip &&
      phone
    ) {
      let resp = await req.db.collection("locations")
      .updateOne(
        { locationId },
        { $set: { name, address, city, state, zip, phone } },
        {
          upsert: true
        }
      );
      console.log("resp", resp.result.nModified);
      return({ message: "aok", resp });
    } else return({ message: "not good data" });
  } catch (e) {
    console.log("catch error", e);
  }
};

export default withMongo(handler);
