import Dayz from "dayz";
import React from "react";
import moment from "moment";
import Card from "react-bootstrap/Card";
import { BsTypeBold } from "react-icons/bs";

function startOfSeason() {
  const now = new Date();
  var month = now.getMonth() + 1;
  var year = now.getFullYear();

  if (month > 0 && month < 9) year -= 1;
  return new Date(`08/30/${year}`);
}
function getSeason(date = new Date()) {
  var month = date.getMonth() + 1;
  var year = date.getFullYear();

  if (month > 0 && month < 9) year -= 1;
  return `${year - 2000}-${year - 1999}`;
}
// from an array matchScores calc the average
function calcStats(scores, handiObj) {
  // saving this maybe handicaps can be added with
  // reduce ...
  /* let totalGames = scores.reduce((a, b) => a + b.games.length, 0);
  let totalPins = scores.reduce(
    (a, b) => a + b.games.reduce((a, b) => a + b, 0),
    0
  );
  let hiGame = scores.reduce((a, b) => Math.max(a, ...b.games),0);
  let hiSeries = scores.reduce((a, b) =>
    Math.max(a, b.games.reduce((a, b) => a + b, 0)),0
  );
  let average = Math.floor(totalPins / totalGames); */
  let average = 0;
  let hiGame = 0;
  let hiSeries = 0;
  let totalGames = 0;
  let totalPins = 0;
  let hiGameHandi = 0;
  let hiSeriesHandi = 0;
  let hiSeriesGames = [];
  let hiSeriesHandiGames = [];
  let handicap = 0;
  scores.forEach((s) => {
    const games = s.games;
    const hg = Math.max(...s.games);
    const ser = s.games.reduce((a, b) => a + b, 0);
    const param = `${s.dateId.toString()}-${s.memberId.toString()}`;
    const hdi = handiObj[param];
    if (hg > hiGame) hiGame = hg;
    if (ser > hiSeries) {
      hiSeries = ser;
      hiSeriesGames = games;
    }
    if (hg + hdi > hiGameHandi) hiGameHandi = hg + hdi;
    if (ser + 3 * hdi > hiSeriesHandi) {
      hiSeriesHandi = ser + 3 * hdi;
      hiSeriesHandiGames = games;
    }
    totalPins += ser;
    totalGames += games.length;
    handicap = hdi;
  });
  average = Math.floor(totalPins / totalGames);
  return {
    average,
    hiGame,
    hiSeries,
    totalGames,
    totalPins,
    hiSeriesGames,
    hiSeriesHandiGames,
    hiSeriesHandi,
    hiGameHandi,
    handicap,
  };
}
// compute the members handicap for the whole season
// this is not efficient but its quick ....
async function makeHandi(db) {
  const scores = await db
    .collection("matchScores")
    .find({ season: getSeason(new Date()) })
    .sort({ date: 1 })
    .toArray();
  const memberIds = scores.map((s) => s.memberId);
  // make unique (no duplicate) ids
  const memIds = [...new Set(memberIds)];
  memIds.sort((a, b) => a - b);
  console.log(memIds);
  const handiObj = {};
  memIds.forEach((m) => {
    const theScores = scores.filter((s) => s.memberId === m);

    let totalPins = 0;
    let gamesTotal = 0;
    theScores.forEach((s, i) => {
      const prop = s.dateId.toString();
      const series = s.games.reduce((acc, cur) => acc + cur, 0);
      totalPins += series;
      gamesTotal += s.games.length;
      let handi = Math.floor(
        0.9 * Math.floor(220 - Math.floor(totalPins / gamesTotal))
      );
      // no negative handicap for bowlers over 220
      if (handi < 0) {
        handi = 0;
      }

      handiObj[`${s.dateId.toString()}-${s.memberId}`] = handi;
    });
  });
  handiObj.season = getSeason(new Date());
  console.log(handiObj);
  let res = await db
    .collection("handicaps")
    .updateOne({ season: getSeason(new Date()) }, { $set: handiObj });
  console.log("write handi obj ", res.result.ok);
  return handiObj;
}
function makeHighScores(scoreArray, handi) {
  const highScores = {};
  // high game Scratch
  scoreArray.sort((a, b) => {
    const h1 = Math.max(...a.games);
    const h2 = Math.max(...b.games);
    return h2 - h1;
  });
  // grab top 3
  let hi = scoreArray.slice(0, 3);
  const hiGScratch = hi.map((s) => {
    return { alias: s.alias, score: Math.max(...s.games).toString() };
  });
  highScores.scratchGame = hiGScratch;
  // high series scratch
  scoreArray.sort((a, b) => {
    const h1 = a.games.reduce((acc, cur) => acc + cur, 0);
    const h2 = b.games.reduce((acc, cur) => acc + cur, 0);
    return h2 - h1;
  });
  hi = scoreArray.slice(0, 3);
  const hiSerScratch = hi.map((s) => {
    return {
      alias: s.alias,
      score:
        s.games.reduce((acc, cur) => acc + cur, 0).toString() +
        " (" +
        s.games.join(", ") +
        ")",
    };
  });
  highScores.scratchSeries = hiSerScratch;
  // high game handi
  scoreArray.sort((a, b) => {
    const h1 =
      Math.max(...a.games) + handi[`${a.dateId.toString()}-${a.memberId}`];
    const h2 =
      Math.max(...b.games) + handi[`${b.dateId.toString()}-${b.memberId}`];
    return h2 - h1;
  });
  hi = scoreArray.slice(0, 3);
  const hiGameHandi = hi.map((s) => {
    return {
      alias: s.alias,
      score:
        (
          Math.max(...s.games) + handi[`${s.dateId.toString()}-${s.memberId}`]
        ).toString() +
        " +" +
        handi[`${s.dateId.toString()}-${s.memberId}`],
    };
  });
  highScores.handiGame = hiGameHandi;
  // high series handi
  scoreArray.sort((a, b) => {
    const h1 =
      a.games.reduce((acc, cur) => acc + cur, 0) +
      3 * handi[`${a.dateId.toString()}-${a.memberId}`];
    const h2 =
      b.games.reduce((acc, cur) => acc + cur, 0) +
      3 * handi[`${b.dateId.toString()}-${b.memberId}`];
    return h2 - h1;
  });
  hi = scoreArray.slice(0, 3);
  const hiSeriesHandi = hi.map((s) => {
    return {
      alias: s.alias,
      score:
        (
          s.games.reduce((acc, cur) => acc + cur, 0) +
          3 * handi[`${s.dateId.toString()}-${s.memberId}`]
        ).toString() +
        " (" +
        s.games.join(", ") +
        ") +" +
        3 * handi[`${s.dateId.toString()}-${s.memberId}`],
    };
  });
  highScores.handiSeries = hiSeriesHandi;

  return highScores;
}
export function makeCalEvents(arr) {
  const events = new Dayz.EventsCollection();
  arr.forEach((d) => {
    const tmp = new MyEvent({
      range: moment.range(moment(d.date), moment(d.date).add(3, "hours")),
      data: d,
    });
    events.events.push(tmp);
  });
  //events.events.push(theEvents);
  // events.events.push(new MyEvent({
  //   range: moment.range(new Date(), moment().add(3, "hours")),
  //   data: "testing2"
  // }))
  // const events = [];
  // arr.forEach(d => {
  //   events.push({
  //     id: d._id,
  //     start: d.date,
  //     title: `\n${d.host} hosting\n ${d.guest} at\n ${d.location}`
  //     // color: 'purple'
  //   });
  // });
  return events;
}
class MyEvent extends Dayz.EventsCollection.Event {
  constructor(props) {
    super(props);
    //console.log('props', props);
    this.data = props.data;
  }
  handleClick = (ev) => console.log("button click", ev.target);
  defaultRenderImplementation() {
    return <SimpleCard data={this.data} map={this.handleClick} />;
  }
}
function SimpleCard(props) {
  // const classes = useStyles();

  // //console.log("data", props.data);
  const { host, guest, location, date } = props.data;
  const theHour = moment(date).format("h a");
  const styles = {
    fontSize: "0.675rem",
    marginBottom: "0",
    marginTop: "1",
  };
  const mapStyle = {
    fontSize: "11px",
    position: "absolute",
    top: "1px",
    right: "2px",
    border: "2px outset orange",
    padding: "0px 2px 0px 1px",
    borderRadius: "3px",
    backgroundColor: "gold",
    color: "Black",
    cursor: "pointer",
  };
  return (
    <Card>
      <Card.Header
        style={{ padding: "0.1rem", backgroundColor: "lightblue" }}
        as="h6"
      >
        <small>{theHour}</small>
      </Card.Header>
      <Card.Body style={{ padding: "10px 10px", background: "aqua" }}>
        <Card.Subtitle style={styles} className="mb-2 text-muted">
          <strong>{host}</strong> hosting
        </Card.Subtitle>
        <Card.Subtitle style={styles} className="mb-2 text-muted">
          <strong>{guest}</strong> at
        </Card.Subtitle>
        <Card.Subtitle style={styles} className="mb-2 text-muted">
          <strong>{location}</strong>
        </Card.Subtitle>
        {location !== "Double Decker Lanes" ? (
          <div style={mapStyle} onClick={props.map.handleClick}>
            {" "}
            Map
          </div>
        ) : null}
      </Card.Body>
    </Card>
  );
}
export { startOfSeason, getSeason, makeHandi, calcStats, makeHighScores };
