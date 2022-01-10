import React, { useState, useEffect, useRef } from "react";
import Header from "components/header";
import AdminHeader from "components/adminHeader";
import { useStoreContext } from "components/Store";
import { Container, Row, Col, Form, Button, Table } from "react-bootstrap";
import { format, compareAsc, parseISO } from "date-fns";

import { useReactToPrint } from "react-to-print";
import { makeChunks, getSeason } from "libs/utils";

function Squads() {
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  const findDate = () => {
    const theDateId = dateId ? dateId : dates[0].dateId;
    console.log("DateId", theDateId);
    const theDate = dates.find((d) => {
      return d.dateId === theDateId;
    });
    return theDate.date;
  };
  const maxTeamSize = () => {
    const theDateId = dateId ? dateId : dates[0].dateId;
    console.log("DateId", theDateId);
    const theDate = squads.find((d) => {
      return d.dateId === theDateId;
    });
    return theDate.teamsizemax;
  };

  const [dateId, setDateId] = useState(null);
  const {
    squads,
    getSquads,
    setSquads,
    hasSquads,
    allMembers,
    getAllMembers,
    hasAllMembers,
    updateSquad,
    setActive,
  } = useStoreContext();
  useEffect(() => {
    getAllMembers();
    getSquads();
    setActive("admin.squads");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  let dates;
  const butStyleM = {
    backgroundColor: "#a5a5a5d9",
    boxShadow: "3px 3px 4px 1px rgba(100, 100, 100, 240)",
    border: "3px solid",
    borderRadius: "6px",
    borderStyle: "outset",
    borderColor: "rgb(220, 220, 220)",
    textTransform: "none",
    minWidth: "100px",
    minHeight: "60px",

    fontSize: "smaller",
    padding: "5px",
  };

  const squadButtom = {
    backgroundColor: "#fd9133",
    boxShadow: "3px 3px 4px 1px rgb(100, 100, 100, 240)",
    border: "3px solid",
    borderRadius: "6px",
    borderStyle: "outset",
    borderColor: "rgb(220, 220, 220)",
    textTransform: "none",
    minWidth: "100px",
    minHeight: "60px",
    maxHeight: "60px",
    fontSize: "smaller",
    padding: "5px",
  };

  const handleChange = (event) => {
    setDateId(parseInt(event.target.value));
  };
  const add = (member) => {
    console.log("adding", member.alias);

    const theSquad = squads.find(
      (s) => s.dateId === (dateId ? dateId : dates[0].dateId)
    ).squad;
    // get the position for the new bowler
    const pos =
      theSquad.length === 0 ? 1 : theSquad[theSquad.length - 1].pos + 1;
    console.log(pos);
    const data = { name: member.alias, pos, id: member.memberId };
    theSquad.push(data);
    // update the local data in our store
    setSquads([...squads]);
    // update the remote store
    updateSquad({ dateId: dateId ? dateId : dates[0].dateId, squad: theSquad });
  };

  const remove = (member) => {
    console.log("removing", member.name);
    let theSquad = squads.find(
      (s) => s.dateId === (dateId ? dateId : dates[0].dateId)
    ).squad;
    // get the index of the element to remove
    const pos = theSquad.findIndex((m) => m.id === member.id);
    console.log(pos);
    theSquad.splice(pos, 1);
    // remap pos
    theSquad = theSquad.map((s, i) => ({ ...s, pos: i + 1 }));

    // update the remote store
    updateSquad({ dateId: dateId ? dateId : dates[0].dateId, squad: theSquad });
  };
  if (hasSquads && hasAllMembers && squads.length > 0) {
    dates = squads.map((d) => {
      return { date: d.date, match: `${d.host}-${d.guest}`, dateId: d.dateId };
    });
    const theSquad = squads.find(
      (s) => s.dateId === (dateId ? dateId : dates[0].dateId)
    ).squad;
    const members = allMembers
      .sort((a, b) => {
        const a1 = a.alias.split(" ").slice(-1)[0];
        const b1 = b.alias.split(" ").slice(-1)[0];
        if (a1 < b1) return -1;
        if (a1 > b1) return 1;
        return 0;
      })
      .filter((m) => {
        const val =
          !theSquad.find((s) => s.id === m.memberId) && m.active ? true : false;
        return val;
      })
      .map((m) => {
        return {
          alias: m.alias.replace("Guest - ", ""),
          memberId: m.memberId,
          guest: m.guest,
          pos: m.pos,
        };
      });
    console.log("first member", members[0]);

    return (
      <>
        <Header />
        <Container
          style={{
            marginTop: "-5px",
          }}
        >
          <AdminHeader />
          <h2 className="text-center">Squads</h2>
          <button onClick={handlePrint}>Print the squad!</button>
          <Form>
            <Form.Group>
              <Form.Label>Select the Match Date</Form.Label>
              <Row>
                <Form.Control
                  as="select"
                  onChange={handleChange}
                  style={{ width: "33%" }}
                >
                  {dates.map((d, i) => {
                    const title = `${format(
                      parseISO(d.date),
                      "MMM. d, yyyy"
                    )} ${d.match.replace("-", " hosting ")} `;
                    return (
                      <option key={i} value={d.dateId}>
                        {title}
                      </option>
                    );
                  })}
                </Form.Control>
              </Row>
            </Form.Group>
          </Form>

          <Row>
            <Col>
              {members.map((m, i) => {
                return (
                  <button key={i} style={butStyleM} onClick={() => add(m)}>
                    {m.alias}
                  </button>
                );
              })}
            </Col>

            <Col>
              {theSquad.map((m, i) => {
                return i === maxTeamSize() ? (
                  <>
                    <div>========== waiting ==========</div>
                    <button
                      key={i}
                      style={squadButtom}
                      onClick={() => remove(m)}
                    >
                      {m.name}
                    </button>
                  </>
                ) : (
                  <button key={i} style={squadButtom} onClick={() => remove(m)}>
                    {m.name}
                  </button>
                );
              })}
            </Col>
            <Col ref={componentRef} className="hide-on-screen">
              <h2 className="text-center">
                Squad for: {format(parseISO(findDate()), "E MMM d yyyy")}
              </h2>
              <Table striped bordered hover>
                <tbody>
                  {makeChunks(theSquad, 4).map((r, i) => {
                    return i * 4 === maxTeamSize() ? (
                      <>
                        <tr key={i}>
                          <td key={i}>Waiting</td>
                          <td key={i + 1}>=====</td>
                          <td key={i + 2}>=====</td>
                          <td key={i + 3}>List</td>
                        </tr>
                        <tr key={i}>
                          {r.map((d, i) => {
                            return <td key={i}>{d.name}</td>;
                          })}
                        </tr>
                      </>
                    ) : (
                      <tr key={i}>
                        {r.map((d, i) => {
                          return <td key={i}>{d.name}</td>;
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </Col>
          </Row>
        </Container>
      </>
    );
  } else if (hasSquads && squads.length === 0) {
    return (
      <>
        <Header />
        <Container
          style={{
            marginTop: "-5px",
          }}
        >
          <AdminHeader />
          <div>No future Dates / Squads available</div>
        </Container>
      </>
    );
  }

  return <div>Waiting add Progress indicator here!</div>;
}

export default Squads;
