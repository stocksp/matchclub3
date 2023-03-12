import React, { useState, useEffect } from "react"
import Header from "components/header"
import AdminHeader from "components/adminHeader"
import { Container } from "react-bootstrap"
import { format, compareAsc } from "date-fns"
import EditGames from "components/editGames"

import { Table, Button, Row, Col, Form, Spinner } from "react-bootstrap"

import * as yup from "yup"
import { ErrorMessage } from "@hookform/error-message"
import { yupResolver } from "@hookform/resolvers/yup"
import { useForm, Controller } from "react-hook-form"
import { useStoreContext } from "components/Store"
import Router from "next/router"

function Games() {
  const { hasDates, dates, setActive, scores, getScores, hasScores, updateScores } =
    useStoreContext()

  useEffect(() => {
    setActive("admin.games")
    getScores()
  }, [])

  // send to EditGames
  // return only dates in the past
  // can't have scores for dates that have not happened
  const filterDates = () => {
    const now = new Date()
    let thedates = dates.filter((elem, index) => {
      return compareAsc(now, elem.date) === 1
    })
    return thedates
  }

  if (dates?.length > 0 && scores?.length > 0) {
    return (
      <>
        <Header />
        <Container
          style={{
            marginTop: "-5px",
          }}
        >
          <AdminHeader />
          <h2>Scores By Date</h2>
          <EditGames dates={filterDates()} scores={scores} updateScores={updateScores} />
        </Container>
      </>
    )
  } else if (dates?.length > 0 && scores?.length === 0) {
    return (
      <>
        <Header />
        <Container
          style={{
            marginTop: "-5px",
          }}
        >
          <AdminHeader />
          <h2>No Games Bowled this Season!!!</h2>
        </Container>
      </>
    )
  } else {
    if (hasDates && scores?.length === 0) {
      Router.push("/admin/dates")
      return null
    }
    return (
      <Container
        style={{
          marginTop: "10%",
        }}
      >
        {" "}
        <Spinner animation="border" variant="dark" />
        <Spinner animation="grow" variant="dark" />{" "}
      </Container>
    )
  }
}

export default Games
