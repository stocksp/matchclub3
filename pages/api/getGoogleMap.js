import { withMongo } from "../../libs/mongo";

const handler = async (req, res) => {
  try {
    console.log("starting getGoogleMap:", req.query.location);

    const location = await req.db
      .collection("locations")
      .findOne({ name: req.query.location });
    if (location) {
      let from_address = "300%20Golf%20Course%20Drive,Rohnert%20Park,CA";
      let to_address = `${location.address},${location.city},${location.state}`;
      to_address = to_address.replace(/ /g, "%20");

      let link = `http://maps.google.com/maps?f=d&source=s_d&saddr=${from_address}&daddr=${to_address}`;
      console.log('link', link)
      res.json([link, to_address]);
    }

  } catch (error) {
    res.json("Error: " + error.toString());
  }
}
export default withMongo(handler);
