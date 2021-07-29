import { useState, useEffect } from "react";
import Router from "next/router";
import Header from "components/header";
import { Modal, Button, ButtonToolbar, Container } from "react-bootstrap";
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
  } = useStoreContext();
  useEffect(() => {
    setActive("0");
  }, []);

  const [dateSelected, setDateSelected] = useState(null);
  //const [showLogin, setShowLogin] = useState(false);
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
      window.open(url, "_blank");
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
        "ddd MMMM d"
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
    console.log("the weeks", weeks);
    return (
      <Container>
        <Header />
        <Container fluid className="grid text-center">
          <div>Sunday</div>
          <div>Monday</div>
          <div>Tuesday</div>
          <div>Wednesday</div>
          <div>Thursday</div>
          <div>Friday</div>
          <div>Saturday</div>
          {weeks.map((w, i) =>
            w.map((d, i2) => {
              if (d.date)
                return (
                  <DayCard
                    key={(i + 1) * i2}
                    data={d}
                    onClick={(e) => onDayClick(e, d)}
                  />
                );
              else return <EmptyCard key={(i + 1) * i2} data={d} />;
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
      </Container>
    );
  } else {
    return <div>Waiting add Progress indicator here!</div>;
  }
};

export default Index;
