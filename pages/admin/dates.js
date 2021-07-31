import React, { useState, useEffect } from "react";
import Header from "../../components/header";
import AdminHeader from "../../components/adminHeader";
import { MdEdit, MdDeleteForever } from "react-icons/md";
import {
  Container,
  Table,
  Button,
  Row,
  Col,
  Form,
  Spinner,
} from "react-bootstrap";
import { format, compareAsc } from "date-fns";
import { useStoreContext } from "components/Store";
import EditDate from "../../components/editDate";

function Dates() {
  const [dateToEdit, setDateToEdit] = useState(null);
  const {
    dates,
    setActive,
    clubsLocations,
    getClubsLocations,
  } = useStoreContext();
  useEffect(() => {
    setActive("admin.dates");
    getClubsLocations();
  }, []);

  const handleClose = () => {
    setDateToEdit(null);
  };
  const doEdit = (date, index) => {
    console.log("setting do Edit true");
    setDateToEdit(date);
  };
  const doDelete = (date) => {
    console.log("delete this guy", date.dateId);
  };
  const doNew = () => {
    setDateToEdit({
      date: new Date(),
      host: "Continental",
      guest: "Continental",
      location: "Double Decker Lanes",
      teamsizemax: 16,
      hasmeeting: false,
      squad: [],
    });
  };
  const inFuture = (date) => compareAsc(date, new Date()) === 1;
  if (!clubsLocations)
    return (
      <>
        <Header />
        <Container
          style={{
            marginTop: "-5px",
            marginLeft: "5%",
            marginRight: "5%",
          }}
        >
          <AdminHeader /> <Spinner animation="border" variant="dark" />
          <Spinner animation="grow" variant="dark" />{" "}
        </Container>
      </>
    );

  return (
    <>
      <Header />
      <Container
        style={{
          marginTop: "-5px",
        }}
      >
        <AdminHeader />
        {!dateToEdit ? (
          <>
            <h2 className="text-center">
              Dates
              <span>
                <Button variant="primary" onClick={doNew}>
                  Create New
                </Button>
              </span>
            </h2>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Host Club</th>
                  <th>Guest Club</th>
                  <th>Location</th>
                  <th>Max Size</th>
                  <th>Meeting</th>
                </tr>
              </thead>
              <tbody>
                {dates.map((d, i) => {
                  return (
                    <tr key={i}>
                      <td align="left">
                        {format(d.date, "MMM d yyyy")}
                      </td>
                      <td align="left">{d.host}</td>
                      <td align="left">{d.guest}</td>
                      <td align="left">{d.location}</td>
                      <td align="left">{d.teamsizemax}</td>
                      <td align="left">{d.hasmeeting ? "yes" : "no"}</td>

                      <td align="left" style={{ cursor: "pointer" }}>
                        <MdEdit onClick={() => doEdit(d, i)} size={"1.5em"} />
                        &nbsp;&nbsp;&nbsp;
                        {inFuture(d.date) ? (
                          <MdDeleteForever
                            size={"1.5em"}
                            onClick={() => doDelete(d)}
                          />
                        ) : null}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </>
        ) : (
          <EditDate
            doClose={handleClose}
            date={dateToEdit}
            clubsLocations={clubsLocations}
            dates={dates}
          ></EditDate>
        )}
      </Container>
    </>
  );
}

export default Dates;
