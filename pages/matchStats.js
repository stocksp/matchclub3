import Header from "../components/header";
import React, { useState, useEffect } from "react";
import { useStoreContext } from "../components/Store";
import { Table, Form } from "react-bootstrap";
import moment from "moment";

function MatchStats() {
  const [sortBy, setSortBy] = useState("average");
  const [dir, setDir] = useState("desc");
  const [dateId, setDateId] = useState(null);
  const { getMatchStats, matchStats, setActive } = useStoreContext();
  useEffect(() => {
    setActive("matchStats");
    getMatchStats();
    //return setActive(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getDates = () => {
    // taken from https://stackoverflow.com/questions/36032179/remove-duplicates-in-an-object-array-javascript
    let thedates = matchStats[0].filter(
      (elem, index, self) =>
        self.findIndex((m) => {
          return m.dateId === elem.dateId;
        }) === index
    );
    return thedates.map((d) => {
      return { date: d.date, match: d.match, dateId: d.dateId };
    });
  };

  const sortMe = (who) => {
    if (sortBy === who) {
      setDir(dir === "desc" ? "asc" : "desc");
    } else {
      setSortBy(who);
    }
    console.log(who);
  };
  const sorter = (a, b) => {
    if (dir === "desc") return b[sortBy] - a[sortBy];
    else return a[sortBy] - b[sortBy];
  };
  const handleChange = (event) => {
    console.log("select", event.target.value);
    setDateId(parseInt(event.target.value));
  };

  if (matchStats) {
    const theData = matchStats[0]
      .filter((s) => s.dateId === (dateId ? dateId : matchStats[0][0].dateId))
      .sort(sorter);
    // make the dates for the input selector
    const dates = getDates(matchStats[0]);

    return (
      <>
        <Header />
        <h2 className="text-center">Match Stats</h2>
        <Form>
          <Form.Group controlId="exampleForm.SelectCustom">
            <Form.Label>Select the Match Date</Form.Label>
            <Form.Control as="select" custom onChange={handleChange}>
              {dates.map((d, i) => {
                const teamRes = matchStats[1].find(
                  (t) => t.dateId === d.dateId
                );
                const title = `${moment(d.date).format(
                  "MMM. D, YYYY"
                )} ${d.match.replace("-", " hosting ")} [Won ${
                  teamRes.won
                } Lost ${teamRes.lost}]  `;
                return (
                  <option key={i} value={d.dateId}>
                    {title}
                  </option>
                );
              })}
            </Form.Control>
          </Form.Group>
        </Form>
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th>Member</th>
              <th onClick={() => sortMe("average")}>Average&nbsp;↕️</th>
              <th onClick={() => sortMe("series")}>Hi Series&nbsp;↕️</th>
              <th onClick={() => sortMe("hiGame")}>Hi Game&nbsp;↕️</th>

              <th onClick={() => sortMe("game1")}>Game&nbsp;1&nbsp;↕️</th>
              <th onClick={() => sortMe("game2")}>Game&nbsp;2&nbsp;↕️</th>
              <th onClick={() => sortMe("game3")}>Game&nbsp;3&nbsp;↕️</th>

              <th onClick={() => sortMe("hiGameHandi")}>
                Hi&nbsp;Game&nbsp;hcp&nbsp;↕️
              </th>
              <th onClick={() => sortMe("seriesHandi")}>
                Series&nbsp;hcp&nbsp;↕️
              </th>

              <th>Handi</th>
            </tr>
          </thead>
          <tbody>
            {theData.map((r, i) => {
              return (
                <tr key={i}>
                  <td key={1}>{r.alias.replace(/ /g, "\u00a0")}</td>
                  <td key={2}>{r.average}</td>
                  <td key={3}>{r.series}</td>
                  <td key={4}>{r.hiGame}</td>
                  <td key={5}>{r.game1}</td>
                  <td key={6}>{r.game2}</td>
                  <td key={7}>{r.game3}</td>
                  <td key={8}>{r.hiGameHandi}</td>
                  <td key={9}>{r.seriesHandi}</td>

                  <td key={10}>{r.handi}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </>
    );
  }
  return <div>Waiting add Progress indicator here!</div>;
}

export default MatchStats;
