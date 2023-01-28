import React, { useContext, useState, useEffect } from "react";

import { Tab, Row, Col, ListGroup, Form } from "react-bootstrap";
import { format } from "date-fns";
import { useStoreContext } from "./Store";

const LandingScores = () => {
  const [dateId, setDateId] = useState(null);
  const { getHighScores, highScores, dates } = useStoreContext();

  useEffect(() => {
    getHighScores();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getDates = () => {
    return dates.filter((d) => {
      const found = highScores.dateResults.find((r) => r.dateId === d.dateId);
      return found !== undefined;
    });
  };
  const handleChange = (event) => {
    setDateId(parseInt(event.target.value));
  };
  if (highScores && highScores.dateResults.length > 0) {
    const theDates = getDates();
    const theDateId = dateId ? dateId : theDates[0].dateId;

    const theData = highScores.results.find(
      (r) => r.dateId === (dateId ? dateId : theDateId)
    );
    if (!theData) {
      return <div>oops</div>;
    }
    return (
      <container id="landingScores">
        <Row className="justify-content-cstart ">
          <Col sm={12} md={8} lg={6}>
            <Form.Control as="select" onChange={handleChange}>
              {theDates.map((d, i) => {
                const teamRes = highScores.dateResults.find(
                  (t) => t.dateId === d.dateId
                );
                const title = `${format(d.date, "MMM. d, yyyy")} ${d.host
                  } hosting ${d.guest} [Won ${teamRes.won} Lost ${teamRes.lost}]  `;
                return (
                  <option key={i} value={d.dateId}>
                    {title}
                  </option>
                );
              })}
            </Form.Control>
          </Col>
        </Row>
        <Row>
          <Tab.Container defaultActiveKey="#link1">
            <Col sm={4} xl={2}>
              <ListGroup>
                <ListGroup.Item
                  action
                  href="#link1"
                  className="list-group-item"
                >
                  🔥 High Game
                </ListGroup.Item>
                <ListGroup.Item
                  action
                  href="#link2"
                  className="list-group-item"
                >
                  🔥 High Series
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col  sm={8} xl={4}>
              <Tab.Content>
                <Tab.Pane eventKey="#link1">
                  {theData.data.scratchGame.map((b, i) => (
                    <>
                      <Row>
                        <Col className="d-flex justify-content-end px-0 text-primary">{b.alias}:</Col>
                        <Col className="d-flex justify-content-start ps-1">{b.score}</Col>
                      </Row>
                    </>
                  ))}
                </Tab.Pane>
                <Tab.Pane eventKey="#link2">
                  {theData.data.scratchSeries.map((b, i) => (
                    <>
                      <Row>
                        <Col className="d-flex justify-content-end px-0 text-primary">{b.alias}:</Col>
                        <Col className="d-flex justify-content-start ps-1">{b.score}</Col>
                      </Row>
                    </>
                  ))}
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Tab.Container>
          <Tab.Container defaultActiveKey="#link3">
            <Col sm={4} xl={2}>
              <ListGroup>
                <ListGroup.Item
                  action
                  href="#link3"
                  className="list-group-item"
                >
                  🔥 Hi Game Handi
                </ListGroup.Item>
                <ListGroup.Item
                  action
                  href="#link4"
                  className="list-group-item"
                >
                  🔥 Hi Series Handi
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col sm={8} xl={4}>
              <Tab.Content>
                <Tab.Pane eventKey="#link3">
                  {theData.data.handiGame.map((b, i) => (
                    <>
                      <Row>
                        <Col className="d-flex justify-content-end px-0 text-primary">{b.alias}:</Col>
                        <Col className="d-flex justify-content-start ps-1">{b.score}</Col>
                      </Row>
                    </>
                  ))}
                </Tab.Pane>
                <Tab.Pane eventKey="#link4">
                  {theData.data.handiSeries.map((b, i) => (
                    <>
                      <Row>
                        <Col className="d-flex justify-content-end px-0 text-primary">{b.alias}:</Col>
                        <Col className="d-flex justify-content-start ps-1">{b.score}</Col>
                      </Row>
                    </>
                  ))}
                </Tab.Pane>
              </Tab.Content>
            </Col>

          </Tab.Container>
        </Row>
      </container>
    );
  } else return null;
};
export default LandingScores;
