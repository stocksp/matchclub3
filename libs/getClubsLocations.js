import { withMongo } from "./mongo";

const handler = async (req, res) => {
  try {
    console.log("starting getClubsLocations:");

    const clubs = await req.db
    .collection("clubs")
    .find({})
    .project({ _id: 0 })
    .sort({ name: 1 })
    .toArray();

    const locations = await req.db
      .collection("locations")
      .find({})
      .project({ _id: 0 })
      .sort({ name: 1 })
      .toArray();

    console.log("founda clubs and locations", clubs.length, locations.length);
    return {message: "ok", clubs, locations};
  } catch (error) {
    res.json("Error: " + error.toString());
  }
};
export default withMongo(handler);