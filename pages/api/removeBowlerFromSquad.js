import { withMongo } from "../../libs/mongo";

const handler = async (req, res) => {
  console.log(
    "running removeBowlerFromSquad",
    req.body.dateId,
    req.body.bowlerId
  );
  try {
    const dateId = parseInt(req.body.dateId);
    const bowlerId = parseInt(req.body.bowlerId);

    if (dateId && bowlerId) {
      // get the squad with requested dateId
      // squad is an object with squad property with our array
      const squad = await req.db
        .collection("dates")
        .findOne(
          { dateId },
          { projection: { squad: 1, _id: 0 } }
        );
      let theSquad = squad.squad;

      // remove the one element
      theSquad = theSquad.filter((e) => e.id !== bowlerId);
      //sort it just to be safe
      theSquad.sort((a, b) => a.pos - b.pos);
      // remap the pos to remove the hole if its not on the end
      theSquad = theSquad.map((b, i) => {
        return { ...b, pos: i + 1 };
      });

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
