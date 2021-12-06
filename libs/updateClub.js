import { withMongo } from "libs/mongo";
const handler = async (req, res) => {
  console.log("running updateClub");
  try {
    const locationId = parseInt(req.body.locationId);
    const clubId = parseInt(req.body.clubId)
    const name = req.body.name;
    const address = req.body.address;
    const city = req.body.city;
    const state = req.body.state;
    const zip = req.body.zip;
    const phone = req.body.phone;
    const houseName =req.body.houseName

    if (
      locationId &&
      clubId &&
      name &&
      address &&
      city &&
      state &&
      zip &&
      phone && 
      houseName
    ) {
      let resp = await req.db.collection("clubs")
      .updateOne(
        { clubId },
        { $set: { name, address, city, state, zip, phone, houseName, locationId } },
        {
          upsert: true
        }
      );
      console.log("resp", resp.modifiedCount);
      return({ message: "aok", resp });
    } else return({ message: "not good data" });
  } catch (e) {
    console.log("catch error", e);
  }
};

export default withMongo(handler);
