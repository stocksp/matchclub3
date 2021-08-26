import updateDate from "libs/updateDate";
import updateLocation from "libs/updateLocation";
import updateClub from "libs/updateClub";
import updateMember from "libs/updateMember";
import removeDate from "libs/removeDate";

const handler = async (req, res) => {
  const name = req.query.name;
  console.log("starting updateData:");

  if (name === "updateDate") {
    const data = await updateDate(req, res);
    if (data.message == "ok") {
      res.json({ message: "aok" });
    } else res.json("Error: " + data.toString());
  } else if (name === "updateLocation") {
    const data = await updateLocation(req, res);
    if (data.message == "aok") {
      res.json({ message: "aok" });
    } else res.json("Error: " + data.toString());
  } else if (name === "updateMember") {
    const data = await updateMember(req, res);
    if (data.message == "aok") {
      res.json({ message: "aok" });
    } else res.json("Error: " + data.toString());
  } else if (name === "updateClub") {
    const data = await updateClub(req, res);
    if (data.message == "aok") {
      res.json({ message: "aok" });
    } else res.json("Error: " + data.toString());
  } else if (name === "removeDate") {
    const data = await removeDate(req, res);
    if (data.message == "aok") {
      res.json({ message: "aok" });
    } else res.json("Error: " + data.toString());
  } else {
    console.log("Bad name no go");
    res.json("Error: bad query name");
  }
};

export default handler;
