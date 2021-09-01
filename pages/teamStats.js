import Header from "../components/header";
import React, { useState, useEffect } from "react";
import { useStoreContext } from "../components/Store";
import { Table, Button, Spinner } from "react-bootstrap";

function TeamStats() {
  const [sortBy, setSortBy] = useState("average");
  const [dir, setDir] = useState("desc");
  const { hasTeamStats, teamStats, getTeamStats, setActive } =
    useStoreContext();
  useEffect(() => {
    setActive("teamStats");
    getTeamStats();
    //return setActive(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sortMe = (who) => {
    console.log("sortme", who, sortBy);
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
  if (teamStats.length) teamStats.sort(sorter);
  if (hasTeamStats)
    return (
      <>
        <Header />
        <h2 className="text-center">Team Stats</h2>
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th>Member</th>
              <th onClick={() => sortMe("average")}>Average&nbsp;↕️</th>
              <th onClick={() => sortMe("hiGame")}>Hi Game&nbsp;↕️</th>
              <th onClick={() => sortMe("hiSeries")}>Hi Series&nbsp;↕️</th>
              <th onClick={() => sortMe("hiGameHandi")}>
                Hi&nbsp;Game
                <br />
                handi&nbsp;↕️
              </th>
              <th>
                Hi&nbsp;Series
                <br />
                handi
              </th>
              <th>
                Hi Series
                <br />
                games
              </th>
              <th>
                Hi Series
                <br />
                HandiGames
              </th>
              <th>Total Pins</th>
              <th>Total Games</th>
              <th>Handi</th>
            </tr>
          </thead>
          <tbody>
            {teamStats.map((r, i) => {
              return (
                <tr key={i}>
                  <td key={1}>{r.member}</td>
                  <td key={2}>{r.average}</td>
                  <td key={3}>{r.hiGame}</td>
                  <td key={4}>{r.hiSeries}</td>
                  <td key={5}>{r.hiGameHandi}</td>
                  <td key={6}>{r.hiSeriesHandi}</td>
                  <td key={7}>{r.hiSeriesGames.join(",")}</td>
                  <td key={8}>{r.hiSeriesHandiGames.join(",")}</td>
                  <td key={9}>{r.totalPins}</td>
                  <td key={10}>{r.totalGames}</td>
                  <td key={11}>{r.handicap}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
        {teamStats.length === 0 && (
          <h5 className="text-center">No Data yet this season!</h5>
        )}
      </>
    );

  return (
    <>
      <Button variant="primary" disabled>
        <Spinner
          as="span"
          animation="grow"
          size="sm"
          role="status"
          aria-hidden="true"
        />
        <span> Loading...</span>
      </Button>
    </>
  );
}

export default TeamStats;
