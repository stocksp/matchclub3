import React, { useContext } from "react";
import { useStoreContext } from "../components/Store";
import { Table, Button, Row, Col } from "react-bootstrap";
import { makeChunks } from "libs/utils";

const Squad = (props) => {
  const { user, hasSquad, squad, dates } = useStoreContext();
  const theDate = dates.find((d) => d.dateId === props.date);

  const theData = makeChunks(squad, 4);
  //const hasUser = user && squad.find(b => b.id === user.memberId);
  return (
    <Table striped bordered hover>
      <tbody>
        {hasSquad
          ? theData.map((r, i) => {
              return (
                <tr key={i}>
                  {r.map((d, i) => {
                    const waiting = d.pos > theDate.teamsizemax;
                    const isUser = d.id === (user && user.memberId);
                    const name = waiting ? d.name + '==>wait list' : d.name
                    return (
                      <td
                        key={i}
                        style={isUser ? { color: "crimson" } : null}
                        /* className={
                          waiting && isUser
                            ? "waiting user"
                            : isUser
                            ? "user"
                            : waiting
                            ? "waiting"
                            : null
                        } */
                      >
                        {name}
                      </td>
                    );
                  })}
                </tr>
              );
            })
          : "Gettng the Data....."}
      </tbody>
    </Table>
  );
};

export default Squad;
