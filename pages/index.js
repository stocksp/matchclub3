import { useState, useEffect } from "react";
import Header from "components/header";
import { Modal, Button, ButtonToolbar, Container } from "react-bootstrap";
import Squad from "components/squad";



import { useStoreContext } from "../components/Store";
import { makeCalEvents } from "../libs/utils";
import moment from "moment";
import Dayz from "dayz";
import LandingScores from "components/landingScores";

const Index = () => {
  const {
    currentUser,
    currentDate,
    dates,
    hasDates,
    setActive,
    hasSquad,
    setHasSquad,
    squad,
    getSquad,
    doSquadAction,
  } = useStoreContext();
  useEffect(() => {
    setActive("0");
  }, []);
  const [dateSelected, setDateSelected] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [isAfter, setIsAfter] = useState(false);
  const [footerText, setFooterText] = useState("");

  const handleClose = () => {
    setHasSquad(false);
    setDateSelected(null);
    setFooterText("");
  };
  const handleSquadAction = async (action) => {
    setFooterText("updating ....");
    const resp = await doSquadAction(
      action,
      dateSelected,
      currentUser.memberId,
      currentUser.alias
    );
    console.log(resp);
    if (resp.message === "aok") {
      setFooterText("Update Successful!");
    } else {
      setFooterText("Houston we had a problem!!");
    }
    getSquad(dateSelected);
  };

  const onEventClick = async (ev, event) => {
    console.log("event click ev:", ev.target, "event:", event);
    //check if map click
    if (ev.target.innerText === "Map") {
      let theLink = await fetch(
        "/api/getGoogleMap?location=" + event.data.location
      );
      const url = await theLink.json()
      window.open(url, "_blank");
      return;
    }
    const matchDate = moment(event.data.date);
    console.log("match date", matchDate);
    const afterMatch =
      matchDate.diff(moment().add(3, "hours")) > 0 ? true : false;
    console.log("after", afterMatch);
    setIsAfter(afterMatch);
    if (currentUser || !afterMatch) {
      setDateSelected(event.data.dateId);
      getSquad(event.data.dateId);
    } else {
      setShowLogin(true);
    }
  };

  //console.log("dates", dates);
  if (hasDates) {
    const theEvents = makeCalEvents(dates);
    const theDate = dates.find((d) => d.dateId === dateSelected);
    // for the modal won't have data till clicked
    let theDisplay = "waiting";
    if (theDate) {
      theDisplay = `${isAfter ? "Who will bowl on " : "Who bowled on "}${moment(
        theDate.date
      ).format("ddd MMMM D")}`;
    }
    let actionStr = "";
    // see if the current user is in the squad
    // so we can determine sign up or remove
    if (currentUser && hasSquad) {
      const found = squad.find((m) => m.id === currentUser.memberId);
      if (found) actionStr = "Remove Me";
      else actionStr = "Sign me up!";
    }
    return (
      <Container>
        <Header />
        
          <Dayz
            display="month"
            date={currentDate}
            events={theEvents}
            onEventClick={onEventClick}
            highlightDays={[moment()]}
          />
          <LandingScores />
       
        <Modal show={hasSquad} onHide={handleClose} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>{theDisplay}</Modal.Title>
          </Modal.Header>
          {dateSelected ? <Squad date={dateSelected} /> : null}
          <Modal.Body>
            <ButtonToolbar className="justify-content-between">
              <Button variant="secondary" onClick={handleClose}>
                CLOSE
              </Button>
              {isAfter && currentUser && (
                <Button
                  variant="primary"
                  onClick={() => handleSquadAction(actionStr)}
                >
                  {actionStr}
                </Button>
              )}
            </ButtonToolbar>
          </Modal.Body>
        </Modal>
      </Container>
    );
  } else {
    return <div>Waiting add Progress indicator here!</div>;
  }
};

export default Index;
