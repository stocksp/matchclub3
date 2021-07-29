import React, { useState, useEffect } from "react";
import Header from "../../components/header";
import AdminHeader from "../../components/adminHeader";
import { Container } from "react-bootstrap";
import { format, compareAsc } from "date-fns";

//import moment from "moment";
import { Table, Button, Row, Col, Form, Spinner } from "react-bootstrap";
import { Formik, Field, FieldArray, getIn, ErrorMessage } from "formik";
import * as yup from "yup";
//import { useForm, Controller, ErrorMessage } from "react-hook-form";
import { useStoreContext } from "../../components/Store";

const schema = yup.object().shape({
  squad: yup.array().of(
    yup.object().shape({
      games: yup.array().of(
        yup
          .number()
          .transform((v) => {
            ///console.log("type", typeof v);
            return isNaN(v) || v === 0 ? void 0 : v;
          })
          .integer()
          .moreThan(-1, "no negatives!")
          .lessThan(301, "Really!?")
      ),
    })
  ),
  won: yup
    .number()
    .integer()
    .moreThan(-1, "no negatives!")
    .lessThan(5, "4 or less"),
  lost: yup
    .number()
    .integer()
    .moreThan(-1, "no negatives!")
    .lessThan(5, "4 or less"),
});

function Games() {
  // const { register, handleSubmit, errors, contro, getValues } = useForm({
  //   mode: "onChange",
  // });
  const { dates, setActive, scores, getScores, updateScores } =
    useStoreContext();
  useEffect(() => {
    setActive("admin.games");
    getScores();
  }, []);

  const [dateId, setDateId] = useState(null);
  const handleDateChange = (event) => {
    setDateId(parseInt(event.target.value));
  };

  const filterDates = () => {
    const now = new Date();
    let thedates = dates.filter((elem, index) => {
      return compareAsc(new Date(), elem.date) === 1;
    });

    return thedates;
  };
  function fsubmit(values) {
    // same shape as initial values
    console.log("all the data ", values);
    const scores = [];
    const dateId = values.date.dateId;
    const match = `${values.date.host}-${values.date.guest}`;
    const season = values.date.season;

    values.squad.forEach((s) => {
      if (!s.games.includes(0)) {
        const games = s.games.map((g) => parseInt(g));
        scores.push({
          games,
          dateId,
          match,
          season,
          memberId: s.id,
          alias: s.name,
          date: values.date.date,
        });
      }
    });
    console.log(
      "submit",
      dateId,
      match,
      season,
      scores,
      values.won,
      values.lost
    );

    values.updateScores(dateId, match, season, scores, values.won, values.lost);
  }
  const handleFocus = (event) => {
    event.target.select();
  };

  if (dates?.length > 0 && scores?.length > 0) {
    //console.log("errors", errors, "values", getValues());
    const theDates = filterDates(dates);
    const theScores = scores.find(
      (s) => s.dateId === (dateId ? dateId : theDates[0].dateId)
    );
    // sort by last name
    theScores.squad.sort((a, b) => {
      const a1 = a.name.split(" ").slice(-1)[0];
      const b1 = b.name.split(" ").slice(-1)[0];
      if (a1 < b1) return -1;
      if (a1 > b1) return 1;
      return 0;
    });

    console.log("theScores", theScores);
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
          <Formik
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
                        custom
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
          </Formik>
        </Container>
      </>
    );
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
    );
  } else {
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
    );
  }
}

export default Games;
