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
          <EditGames dates={filterDates()} scores={scores} />
          {/*           <Formik
            enableReinitialize={true}
            initialValues={{
              squad: theScores.squad,
              won: theScores.won,
              lost: theScores.lost,
              updateScores: updateScores,
              date: dates.find((d) => d.dateId === theScores.dateId),
            }}
            validationSchema={schema}
            onSubmit={fsubmit}
          >
            {({
              handleSubmit,
              handleChange,
              handleBlur,
              values,
              errors,
              touched,
              dirty,
              isValid,
            }) => {
              console.log(
                "values",
                values,
                "touched",
                touched,
                "errors",
                errors,
                "dirty",
                dirty,
                "isValid",
                isValid,
                "won",
                theScores.won
              );
              return (
                <Form>
                  <Form.Group controlId="games">
                    <div>Select the Match Date</div>
                    <Row>
                      <Form.Control
                        as="select"
                        onChange={handleDateChange}
                        style={{ width: "40%" }}
                      >
                        {theDates.map((d, i) => {
                          const title = `${format(d.date, "MMM. d, yyyy")} ${
                            d.host
                          } hosting ${d.guest}`;
                          return (
                            <option key={i} value={d.dateId}>
                              {title}
                            </option>
                          );
                        })}
                      </Form.Control>

                      <Button
                        type="submit"
                        disabled={dirty && isValid ? false : true}
                        onClick={handleSubmit}
                      >
                        Submit
                      </Button>
                      <Form.Group
                        as={Col}
                        md="4"
                        controlId="validationFormik01"
                      >
                        <div>Won</div>
                        <Form.Control
                          style={{ width: "20%" }}
                          type="text"
                          name={`won`}
                          onFocus={handleFocus}
                          onChange={handleChange}
                          value={values.won}
                          onBlur={handleBlur}
                        />
                        <ErrorMessage
                          name="won"
                          component="div"
                          className="formError"
                        />
                        <div>Lost</div>
                        <Form.Control
                          style={{ width: "20%" }}
                          type="text"
                          name={`lost`}
                          onFocus={handleFocus}
                          onChange={handleChange}
                          value={values.lost}
                          onBlur={handleBlur}
                        />
                        <ErrorMessage
                          name="won"
                          component="div"
                          className="formError"
                        />
                      </Form.Group>
                    </Row>
                  </Form.Group>
                  <Table striped bordered hover size="sm">
                    <thead>
                      <tr>
                        <th>Bowler</th>
                        <th>Game&nbsp;1</th>
                        <th>Game&nbsp;2</th>
                        <th>Game&nbsp;3</th>
                        <th>Series</th>
                      </tr>
                    </thead>
                    <tbody>
                      <FieldArray name="squad">
                        {({ move, swap, push, insert, unshift, pop, form }) => {
                          return values.squad.map((s, i) => {
                            //debugger;
                            return (
                              <tr key={i}>
                                <td key={1}>{s.name}</td>
                                <td key={2}>
                                  <Field
                                    name={`squad.${i}.games[0]`}
                                    autoComplete="off"
                                    onFocus={handleFocus}
                                    onBlur={handleBlur}
                                  />
                                  <ErrorMessage
                                    name={`squad.${i}.games[0]`}
                                    className="formError"
                                    component="div"
                                  />
                                </td>
                                <td key={3}>
                                  <Field
                                    name={`squad.${i}.games[1]`}
                                    autoComplete="off"
                                    onFocus={handleFocus}
                                    onBlur={handleBlur}
                                  />
                                  <ErrorMessage
                                    name={`squad.${i}.games[1]`}
                                    className="formError"
                                    component="div"
                                  />
                                </td>
                                <td key={4}>
                                  <Field
                                    name={`squad.${i}.games[2]`}
                                    autoComplete="off"
                                    onFocus={handleFocus}
                                    onBlur={handleBlur}
                                  />
                                  <ErrorMessage
                                    name={`squad.${i}.games[2]`}
                                    className="formError"
                                    component="div"
                                  />
                                </td>
                                <td key={5}>
                                  {s.games.reduce(
                                    (a, b) => a + parseInt(b ? b : 0),
                                    0
                                  )}
                                </td>
                              </tr>
                            );
                          });
                        }}
                      </FieldArray>
                    </tbody>
                  </Table>
                </Form>
              );
            }}
          </Formik> */}
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
