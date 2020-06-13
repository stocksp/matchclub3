import { withMongo } from "../../libs/mongo";

const handler = async (req, res) => {
  console.log(
    "running addBowlerToSquad",
    req.body.dateId,
    req.body.bowlerId,
    req.body.name
  );
  try {
    const dateId = parseInt(req.body.dateId);
    const bowlerId = parseInt(req.body.bowlerId);
    const name = req.body.name;

    if (dateId && bowlerId && name) {
      // get the squad with requested dateId
      // squad is an object with squad property with our array
      const squad = await req.db
        .collection("dates")
        .findOne(
          { dateId },
          { projection: { squad: 1, _id: 0 } }
        );
      const theSquad = squad.squad;
      //sort it just to be safe
      theSquad.sort((a, b) => a.pos - b.pos);
      //add new one
      theSquad.push({ name, pos: squad.squad.length + 1, id: bowlerId });
      //console.log("squad", squad.squad);
      // now add it
      const result = await req.db
        .collection("dates")
        .updateOne({ dateId }, { $set: { squad: theSquad } });

      res.json({ message: "aok", result: result.result.nModified });
    } else {
      res.json({ message: "no update!" });
    }
  } catch (e) {
    console.log("catch error", e);
  }
};

export default withMongo(handler);
