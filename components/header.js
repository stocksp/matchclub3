import React, { useContext, useState, useEffect } from "react"
import Link from "next/link"
import Head from "next/head"
import {
  Navbar,
  Nav,
  NavDropdown,
  Button,
  Modal,
  Form,
  Container,
} from "react-bootstrap"

import { useStoreContext } from "./Store"
import Router from "next/router"
import { format, addMonths, getDay, getDaysInMonth, startOfDay } from "date-fns"
const active = "0"

const navbar = {
  backgroundColor: "rgb(6, 156, 194)",
}
const datebar = {
  backgroundColor: "lightblue",
  padding: "2px",
}

const Header = () => {
  const [showLogin, setShowLogin] = useState(false)

  const { currentDate, setCurrentDate, active, user, doLoggin } =
    useStoreContext()

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
  const handleLogin = () => {
    console.log("handle login")

    if (user) {
      doLoggin()
    } else {
      Router.push("/login")
    }
  }

  //console.log("now", currentDate.toLocaleDateString(), "user", user?.memberId);
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
        <span className="calendarDate">
          {" "}
          {format(currentDate, "MMMM yyyy")}{" "}
        </span>
        <span>
          <Button variant="primary" onClick={handleLogin}>
            {user ? user.alias + " (log out)" : "log in"}
          </Button>
        </span>
      </div>

      <Container style={{ maxWidth: "60%", justifySelf: "left" }}>
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
                <Link
                  href="/member/[id]"
                  as={`/member/${user.memberId}`}
                  passHref
                  legacyBehavior
                >
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
      </Container>
    </div>
  )
}

export default Header
