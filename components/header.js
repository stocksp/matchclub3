import React, { useContext, useState, useEffect } from "react"
import Link from "next/link"
import Head from "next/head"
import { Navbar, Nav, NavDropdown, Button, Modal, Form, Container } from "react-bootstrap"

import { userAtom } from "jotai/user"
import { useAtom } from "jotai"
import { useStoreContext } from "./Store"
import Router from "next/router"
import { format, addMonths, getDay, getDaysInMonth, startOfDay } from "date-fns"
import PersonalBest from "components/personalBest"
const active = "0"

const navbar = {
  backgroundColor: "rgb(6, 156, 194)",
}
const datebar = {
  backgroundColor: "lightblue",
  padding: "2px",
}

const Header = () => {
  const {
    currentDate,
    setCurrentDate,
    active,
    // user,
    //doLoggin,
    highScores,
    dateId,
    dates,
    windowSize,
  } = useStoreContext()
  const [user, setUser] = useAtom(userAtom)

  const today = () => {
    console.log("today")
    setCurrentDate(startOfDay(new Date()))
  }
  const nextMonth = () => {
    setCurrentDate(addMonths(currentDate, +1))
  }
  const previoustMonth = () => {
    setCurrentDate(addMonths(currentDate, -1))
  }

  const handleLogInOut = async () => {
    console.log("handle login and logout")

    if (user) {
      await fetch("/api/logout")
      setUser(null)
      Router.push("/")
    } else {
      Router.push("/login")
    }
  }

  const getTheDate = () => {
    const data = dates.find((d) => {
      return d.dateId === dateId
    })
    console.log("header date", data.date)
    return data.date
  }

  // Shrink navbar div prior to size when hamburger appears
  const windowSizeStyle = windowSize.width < 585 ? "25%" : "60%"

  console.log(
    "now",
    currentDate.toLocaleDateString(),
    "user",
    user?.memberId,
    "highScores",
    highScores,
    "dateId",
    dateId
  )
  return (
    <div
      style={{
        marginBottom: "1%",
      }}
    >
      <Head>
        <title>Match Club</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className="text-center">
        <span className="tinyIcon">🎳</span>
        <span className="mediumIcon">🎳</span>
        🎳Continental Match Club🎳
        <span className="mediumIcon">🎳</span>
        <span className="tinyIcon">🎳</span>
      </h1>

      <div className="text-center" style={datebar}>
        {active === "0" && (
          <span>
            <Button variant="primary" onClick={today}>
              today
            </Button>
            <Button variant="primary" onClick={previoustMonth}>
              ☜
            </Button>
            <Button variant="primary" onClick={nextMonth}>
              ☞
            </Button>
          </span>
        )}
        <span className="calendarDate"> {format(currentDate, "MMMM yyyy")} </span>
        <span>
          <Button variant="primary" onClick={handleLogInOut}>
            {user ? user.alias + " (log out)" : "log in"}
          </Button>
        </span>
      </div>
      <div className="navbar-container">
        <div style={{ width: windowSizeStyle }}>
          <Navbar expand="sm" collapseOnSelect variant="dark" style={navbar}>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav activeKey={active}>
                <Link href="/" passHref legacyBehavior>
                  <Nav.Link eventKey="0">HOME</Nav.Link>
                </Link>
                <Link href="/teamStats" passHref legacyBehavior>
                  <Nav.Link eventKey="teamStats">TEAM STATS</Nav.Link>
                </Link>
                <Link href="/matchStats" passHref legacyBehavior>
                  <Nav.Link eventKey="matchStats">MATCH STATS</Nav.Link>
                </Link>
                <Link href="/memberStats" passHref legacyBehavior>
                  <Nav.Link eventKey="memberStats">MEMBER STATS</Nav.Link>
                </Link>
                {user && (
                  <Link href="/member/[id]" as={`/member/${user.memberId}`} passHref legacyBehavior>
                    <Nav.Link eventKey="member">Your Stuff</Nav.Link>
                  </Link>
                )}
                {user && user.role === "admin" && (
                  <Link href="/admin/games" passHref legacyBehavior>
                    <Nav.Link>ADMIN</Nav.Link>
                  </Link>
                )}
                <Link href="/about" passHref legacyBehavior>
                  <Nav.Link>ABOUT</Nav.Link>
                </Link>
              </Nav>
            </Navbar.Collapse>
          </Navbar>
        </div>
        {/* <div style={{ padding: "0px 0px 0px 10px" }}>
          {highScores ? (
            <p>Best stuff on {getTheDate().toLocaleDateString()}</p>
          ) : null}
          {highScores ? <PersonalBest /> : null}
        </div> */}
      </div>
    </div>
  )
}

export default Header
