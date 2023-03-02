import { Badge, Card } from "react-bootstrap"
import { format, getMinutes } from "date-fns"
import { useState, useEffect } from "react"
import { useStoreContext } from "components/Store"

function DayCard(props) {
  const { user } = useStoreContext()

  const [signedUp, setsignedUp] = useState(false)
  const { host, guest, location, date, hasmeeting } = props.data.date
  useEffect(() => {
    if (user) {
      const foundIt = props.data.date.squad.find((s) => {
        return s.id === user.memberId
      })
      if (foundIt) {
        setsignedUp(true)
      } else {
        setsignedUp(false)
      }
    }
  }, [user, props.data.date.squad])

  console.log("squad", date.squad)

  const theMinutes = date.getMinutes()
  const theHour = theMinutes != 0 ? format(date, "h:m a") : format(date, "h a")
  const theDay = props.data.day
  const now = new Date()
  const styles = {
    fontSize: "0.675rem",
    marginBottom: "7px",
    textAlign: "left",
    color: "rgb(100, 100, 100)",
  }
  const mapStyle = {
    fontSize: "11px",
    position: "absolute",
    bottom: "2px",
    right: "2px",
    border: "2px outset orange",
    padding: "0px 2px 0px 1px",
    borderRadius: "3px",
    backgroundColor: "gold",
    color: "Black",
    cursor: "crosshair",
  }

  return (
    <Card onClick={props.onClick}>
      <Card.Header
        style={{
          padding: "0.1rem",
          height: "28.2px",
          backgroundColor: "rgb(6, 156, 194)",
          cursor: "pointer",
          display: "flex",
        }}
        as="h6"
      >
        <Badge
          style={{
            fontSize: "16px",
            fontWeight: "normal",
            verticalAlign: "center",
            color: "gold",
          }}
        >
          {hasmeeting == true ? (
            <div style={{ fontSize: "11px" }}>{theHour} *Meeting*</div>
          ) : (
            theHour
          )}
          {now.getDate() == date.getDate() &&
          now.getMonth() == date.getMonth() &&
          now.getFullYear() == date.getFullYear() ? (
            hasmeeting == true ? (
              <div style={{ fontSize: "11px" }}>TODAY</div>
            ) : (
              " *TODAY*"
            )
          ) : (
            ""
          )}
        </Badge>
        <Badge style={{ marginLeft: "auto" }}>{signedUp ? "✔️" : ""}</Badge>
        <Badge
          style={{
            fontSize: "16px",
            fontWeight: "normal",
            marginLeft: "auto",
            justifyContent: "left",
            verticalAlign: "center",
            alignContent: "left",
          }}
          variant="light"
        >
          {theDay}
        </Badge>
      </Card.Header>
      <Card.Body
        style={{
          padding: "10px 10px",
          background:
            now.getDate() == date.getDate() &&
            now.getMonth() == date.getMonth() &&
            now.getFullYear() == date.getFullYear()
              ? "orange"
              : "aqua",
          cursor: "pointer",
          verticalAlign: "center",
        }}
      >
        <Card.Subtitle style={styles}>
          <strong>{host}</strong> hosting
        </Card.Subtitle>
        <Card.Subtitle style={styles}>
          <strong>{guest}</strong> at
        </Card.Subtitle>
        <Card.Subtitle style={styles}>
          <strong>{location}</strong>
        </Card.Subtitle>
        {location !== "Double Decker Lanes" ? <div style={mapStyle}> Map</div> : null}
      </Card.Body>
    </Card>
  )
}
export default DayCard
