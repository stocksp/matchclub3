import Header from "../components/header"
import React, { useContext, useState, useEffect } from "react"
import { Table, Form, Row, Col, Container, Button, Spinner, Stack } from "react-bootstrap"
import { useStoreContext } from "../components/Store"
import { format, parseISO } from "date-fns"

function MemberStats() {
  const {
    setActive,
    getMatchStats,
    hasMatchStats,
    matchStats,
    hasTeamStats,
    teamStats,
    getTeamStats,
  } = useStoreContext()
  const [where, setWhere] = useState("all")
  const [memberId, setMemberId] = useState(null)
  useEffect(() => {
    setActive("memberStats")
    if (!hasMatchStats) getMatchStats()
    if (!hasTeamStats) getTeamStats()
  }, [])
  const getBowlers = () => {
    // taken from https://stackoverflow.com/questions/36032179/remove-duplicates-in-an-object-array-javascript
    let thedates = matchStats[0].filter(
      (elem, index, self) =>
        self.findIndex((m) => {
          return m.alias === elem.alias
        }) === index
    )

    return thedates
      .map((d) => {
        return { alias: d.alias, dateId: d.dateId, memberId: d.memberId }
      })
      .sort((a, b) => {
        const nameA = a.alias.toUpperCase().split(' ')[1] // ignore upper and lowercase use last name
        const nameB = b.alias.toUpperCase().split(' ')[1] // ignore upper and lowercase
        if (nameA < nameB) {
          return -1
        }
        if (nameA > nameB) {
          return 1
        }

        // names must be equal
        return 0
      })
  }

  const getBowlerStats = () => {
    const stat = teamStats.find((s) => s.memberId === memberId)
    return (
      <div>
        Average: {stat.average}
        <br />
        High Game: {stat.hiGame}
        <br />
        High Series: {stat.hiSeries}
      </div>
    )
  }

  const handleChange = (event) => {
    setMemberId(parseInt(event.target.value))
  }
  const onRadio = (event) => {
    console.log("where", event.target.value)
    setWhere(event.target.value)
  }

  if (matchStats) {
    const theData = matchStats[0].filter((s) => {
      if (s.memberId === memberId) {
        if (where === "all") return true
        if (where === "local" && s.match.match(/^Continental/i)) return true
        if (where === "away" && s.match.match(/-Continental/)) return true
      }
      return false
    })

    // make the dates for the input selector
    const bowlers = getBowlers()
    // add the initial value
    bowlers.unshift({
      alias: "Please Select a Member",
      dateId: 0,
      memberId: 0,
    })
    return (
      <>
        <Header />
        <Container>
          <h2 className="text-center">Member Stats</h2>
          <Row>
            <Col sm={6} md={4}>
              <Form>
                <Form.Group controlId="exampleForm.SelectCustom">
                  <Form.Label>Select the Bowler: </Form.Label>

                  <Form.Control as="select" onChange={handleChange} style={{ width: "15em" }}>
                    {bowlers.map((d, i) => {
                      return (
                        <option key={i} value={d.memberId}>
                          {d.alias}
                        </option>
                      )
                    })}
                  </Form.Control>
                  <div key={"inline-1"} className="mb-3">
                    <Form.Check
                      onChange={onRadio}
                      inline
                      value="all"
                      label="all"
                      type="radio"
                      id="all"
                      checked={where === "all"}
                    />
                    <Form.Check
                      onChange={onRadio}
                      inline
                      value="local"
                      label="local"
                      type="radio"
                      id="local"
                      checked={where === "local"}
                    />
                    <Form.Check
                      onChange={onRadio}
                      inline
                      value="away"
                      label="away"
                      type="radio"
                      id="away"
                      checked={where === "away"}
                    />
                  </div>
                </Form.Group>
              </Form>
            </Col>
            <Col sm={6}>
              {memberId && teamStats.length > 0 ? (
                <BowlerStats {...teamStats.find((s) => s.memberId === memberId)} />
              ) : null}
            </Col>
          </Row>
          <Table striped bordered hover size="sm">
            <thead>
              <tr>
                <td>Match (Host - Guest)</td>
                <td>Date</td>
                <td>Average</td>
                <td>Series</td>
                <td>Hi&nbsp;Game</td>
                <td>Game&nbsp;1</td>
                <td>Game&nbsp;2</td>
                <td>Game&nbsp;3</td>
                <td>Handi</td>
              </tr>
            </thead>
            <tbody>
              {theData.map((r, i) => {
                return (
                  <tr key={i}>
                    <td key={1}>{r.match}</td>
                    <td key={2}>{format(parseISO(r.date), "MM/dd/yy")}</td>
                    <td key={3}>{r.average}</td>
                    <td key={4}>{r.series}</td>
                    <td key={5}>{r.hiGame}</td>

                    <td key={6}>{r.game1}</td>
                    <td key={7}>{r.games[1]}</td>
                    <td key={8}>{r.games[2]}</td>

                    <td key={9}>{r.handi}</td>
                  </tr>
                )
              })}
            </tbody>
          </Table>
        </Container>
      </>
    )
  } else
    return (
      <>
        <Button variant="primary" disabled>
          <Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" />
          <span> Loading...</span>
        </Button>
      </>
    )
}
const BowlerStats = (props) => {
  return (
    <>
      <Row>
        <Col className="d-flex justify-content-end fs-5 text-primary">Average:</Col>
        <Col className="d-flex justify-content-start fs-5">{props.average}</Col>
      </Row>
      <Row>
        <Col className="d-flex justify-content-end fs-5 text-primary">Hi Game:</Col>
        <Col className="d-flex justify-content-start fs-5">{props.hiGame}</Col>
      </Row>
      <Row>
        <Col className="d-flex justify-content-end fs-5 text-primary">Hi Series:</Col>
        <Col className="d-flex justify-content-start fs-5">{props.hiSeries}</Col>
      </Row>
    </>
  )
}

export default MemberStats
