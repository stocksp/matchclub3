import { useState, useEffect } from "react";
import Router from "next/router";
import Header from "components/header";

import {
  Modal,
  Button,
  ButtonToolbar,
  Container,
  Spinner,
} from "react-bootstrap";
import Squad from "components/squad";

import { useStoreContext } from "../components/Store";
import { getFirstWeek, getNextWeek } from "../libs/utils";

import LandingScores from "components/landingScores";
import DayCard from "components/dayCard";
import EmptyCard from "components/emptyCard";
import {
  format,
  addMonths,
  getDay,
  getDaysInMonth,
  differenceInHours,
  addHours,
} from "date-fns";

const Index = () => {
  const {
    currentDate,
    dates,
    hasDates,
    setActive,
    hasSquad,
    setHasSquad,
    squad,
    getSquad,
    doSquadAction,
    user,
    windowSize,
  } = useStoreContext();
  useEffect(() => {
    setActive("0");
  }, []);

  const [hostAddress, setHostAddress] = useState("");
  const [mapLink, setMapLink] = useState("");
  const [dateSelected, setDateSelected] = useState(null);
  //const [showLogin, setShowLogin] = useState(false);
  const [isAfter, setIsAfter] = useState(false);
  const [footerText, setFooterText] = useState("");

  const handleClose = () => {
    setHasSquad(false);
    setDateSelected(null);
    setFooterText("");
  };
  const mapLinkClose = () => {
    setMapLink("");
  }
  const handleMapLink = () => {
    window.open(mapLink, "_blank");
    setMapLink("")
  }
  const handleSquadAction = async (action) => {
    setFooterText("updating ....");
    const resp = await doSquadAction(
      action,
      dateSelected,
      user.memberId,
      user.alias
    );
    console.log(resp);
    if (resp.message === "aok") {
      setFooterText("Update Successful!");
    } else {
      setFooterText("Houston we had a problem!!");
    }
    getSquad(dateSelected);
  };
  
  const onDayClick = async (ev, data) => {
    console.log("event click ev:", ev.target, "event:", data);
    //check if map click
    if (ev.target.innerText === "Map") {
      let theLink = await fetch(
        "/api/getGoogleMap?location=" + data.date.location
      );
      const url = await theLink.json();
      setMapLink(url[0]);
      setHostAddress(url[1]);
      return;
    }

    console.log("match date", data.date.date);
    const afterMatch =
      differenceInHours(new Date(), addHours(data.date.date, 3)) > 0
        ? true
        : false;
    console.log("after", afterMatch);
    setIsAfter(afterMatch);
    if (user || afterMatch) {
      setDateSelected(data.date.dateId);
      getSquad(data.date.dateId);
    } else {
      Router.push("/login");
    }
  };

  //console.log("dates", dates);
  if (hasDates) {
    //const theEvents = makeCalEvents(dates);
    const theDate = dates.find((d) => d.dateId === dateSelected);
    // for the modal won't have data till clicked
    let theDisplay = "waiting";
    if (theDate) {
      theDisplay = `${isAfter ? "Who bowled on " : "Who will bowl on "}${format(
        theDate.date,
        "MMMM d"
      )}`;
    }
    let actionStr = "";
    // see if the current user is in the squad
    // so we can determine sign up or remove
    if (user && hasSquad) {
      const found = squad.find((m) => m.id === user.memberId);
      if (found) actionStr = "Remove Me";
      else actionStr = "Sign me up!";
    }
    const weeks = [];
    const day1 = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastMonth = addMonths(day1, -1);
    const daysInMonth = getDaysInMonth(day1);
    let theWeek = getFirstWeek(
      getDay(day1),
      getDaysInMonth(lastMonth),
      dates,
      currentDate
    );
    weeks.push(theWeek);
    while (!theWeek.find((d) => d.day === daysInMonth) || weeks.length === 1) {
      theWeek = getNextWeek(
        theWeek[theWeek.length - 1].day,
        daysInMonth,
        dates,
        currentDate
      );
      //console.log(theWeek);
      weeks.push(theWeek);
    }
   // console.log("the weeks", weeks);
    let doShort = windowSize.width < 950 ? true : false;
    
    return (
      <Container>
        <Header />
        <Container
          fluid
          className="grid text-center"
          style={{
            padding: "0px",
            display: "grid",
            gridGap: "1px",
            gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 1fr 2fr",
            overflowX: "hidden",
          }}
        >
          <div>
            <strong>{doShort ? "Sun" : "Sunday"}</strong>
          </div>
          <div>
            <strong>{doShort ? "Mon" : "Monday"}</strong>
          </div>
          <div>
            <strong>{doShort ? "Tue" : "Tuesday"}</strong>
          </div>
          <div>
            <strong>{doShort ? "Wed" : "Wednesday"}</strong>
          </div>
          <div>
            <strong>{doShort ? "Thu" : "Thursday"}</strong>
          </div>
          <div>
            <strong>{doShort ? "Fri" : "Friday"}</strong>
          </div>
          <div>
            <strong>{doShort ? "Sat" : "Saturday"}</strong>
          </div>
          {weeks.map((w, i) =>
            w.map((d, i2) => {
              if (d.date)
                return (
                  <DayCard
                    key={(i + 1) * i2}
                    data={d}
                    day1={day1}
                    onClick={(e) => onDayClick(e, d)}
                  />
                );
              else return <EmptyCard key={(i + 1) * i2} data={d} day1={day1} />;
            })
          )}
        </Container>

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
              {!isAfter && user && (
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
        <Modal show={mapLink !== ""} onHide={mapLinkClose} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>{hostAddress}</Modal.Title>
          </Modal.Header>
          
          <Modal.Body>
            <ButtonToolbar className="justify-content-between">
              <Button variant="secondary" onClick={mapLinkClose}>
                Cancel
              </Button>

              <Button
                variant="primary"
                onClick={handleMapLink}
              >
                GoTo Map
              </Button>

            </ButtonToolbar>
          </Modal.Body>
        </Modal>
      </Container>
    );
  } else {
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
};

export default Index;
