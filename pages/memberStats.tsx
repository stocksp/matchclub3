import Header from "../components/header"
import React, { useContext, useState, useEffect } from "react"
import { Table, Form, Row, Col, Container } from "react-bootstrap"
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

    return thedates.map((d) => {
      return { alias: d.alias, dateId: d.dateId, memberId: d.memberId }
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
            <Col>
              <Form>
                <Form.Group controlId="exampleForm.SelectCustom">
                  <Form.Label>Select the Bowler: </Form.Label>

                  <Form.Control as="select" onChange={handleChange} style={{ width: "10em" }}>
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
            <Col>{memberId && teamStats.length > 0 ? getBowlerStats() : null}</Col>
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
  } else return <div>Waiting add Progress indicator here!</div>
}

export default MemberStats
