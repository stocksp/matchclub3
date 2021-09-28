import { Badge, Card } from "react-bootstrap";
import { format } from "date-fns";

function DayCard(props) {
  // const classes = useStyles();

  // //console.log("data", props.data);
  const { host, guest, location, date } = props.data.date;
  const theHour = format(date, "h a");
  const theDay = props.data.day;
  const now = new Date();
  const styles = {
    fontSize: "0.675rem",
    marginBottom: "7px",
    textAlign: "left",
    color: "rgb(100, 100, 100)",
  };
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
  };
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
          {theHour}
          {now.getDay() == date.getDay() &&
          now.getMonth() == date.getMonth() &&
          now.getFullYear() == date.getFullYear()
            ? " *TODAY*"
            : ""}
        </Badge>
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
            now.getDay() == date.getDay() &&
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
        {location !== "Double Decker Lanes" ? (
          <div style={mapStyle}> Map</div>
        ) : null}
      </Card.Body>
    </Card>
  );
}
export default DayCard;
