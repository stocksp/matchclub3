import React, { useContext } from "react";
import { useStoreContext } from "../components/Store";
import { Table, Button, Row, Col } from "react-bootstrap";

// make array of array to feed
// table tr and td
const makeChunks = (arr, size) => {
  const chunks = [];
  arr.forEach((item) => {
    if (!chunks.length || chunks[chunks.length - 1].length === size)
      chunks.push([]);
    chunks[chunks.length - 1].push(item);
  });
  return chunks;
};

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
                    return (
                      <td
                        key={i}
                        style={
                          d.id === (user && user.memberId)
                            ? { color: "crimson" }
                            : null
                        }
                        className={
                          d.pos > theDate.teamsizemax &&
                          d.id === (user && user.memberId)
                            ? "waiting user"
                            : d.id === (user && user.memberId)
                            ? "user"
                            : null
                        }
                      >
                        {d.name}
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
