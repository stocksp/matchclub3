import React, { useContext } from "react";
import { useStoreContext } from "../components/Store";
import { Table, Button, Row, Col } from "react-bootstrap";
import { makeChunks } from "libs/utils";
import Index from "pages";

const Squad = (props) => {
  const { user, hasSquad, squad, dates } = useStoreContext();
  const theDate = dates.find((d) => d.dateId === props.date);

  const waitingstyle = {
    fontSize: "8px",
    position: "relative",
    textAlign: "left",
    color: "green",
  };

  const theData = makeChunks(squad, 4);
  //const hasUser = user && squad.find(b => b.id === user.memberId);
  return (
    <Table striped bordered hover>
      <tbody>
        {hasSquad && theData.length > 0 ? (
          theData.map((r, i) => {
            return (
              <tr key={i}>
                {r.map((d, i) => {
                  const waiting = d.pos > theDate.teamsizemax;
                  const isUser = d.id === (user && user.memberId);
                  const name = d.name;
                  return (
                    <td key={i} style={isUser ? { color: "crimson" } : null}>
                      <div style={waitingstyle}>
                        {waiting ? "Waiting list" : null}
                      </div>
                      {name}
                    </td>
                  );
                })}
              </tr>
            );
          })
        ) : !hasSquad ? (
          "Gettng the Data....."
        ) : (
          <h2 className="text-center">Be the first to sign up!</h2>
        )}
      </tbody>
    </Table>
  );
};

export default Squad;
