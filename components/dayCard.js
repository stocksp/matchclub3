import { Badge, Card } from "react-bootstrap";
import { format } from "date-fns";

function DayCard(props) {
  // const classes = useStyles();

  // //console.log("data", props.data);
  const { host, guest, location, date } = props.data.date;
  const theHour = format(date, "h a");
  const theDay = props.data.day;
  const styles = {
    fontSize: "0.675rem",
    marginBottom: "0",
    marginTop: "1",
  };
  const mapStyle = {
    fontSize: "11px",
    position: "absolute",
    top: "1px",
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
          backgroundColor: "lightblue",
          cursor: "pointer",
          display: "flex"
        }}
        as="h6"
      >
       <small>{theHour}</small>
        <Badge
          style={{
            marginLeft: "auto",
            justifyContent: "center",
          }}
          variant="light"
        >
          {theDay}
        </Badge>
        
      </Card.Header>
      <Card.Body
        style={{ padding: "10px 10px", background: "aqua", cursor: "pointer" }}
      >
        <Card.Subtitle style={styles} className="mb-2 text-muted">
          <strong>{host}</strong> hosting
        </Card.Subtitle>
        <Card.Subtitle style={styles} className="mb-2 text-muted">
          <strong>{guest}</strong> at
        </Card.Subtitle>
        <Card.Subtitle style={styles} className="mb-2 text-muted">
          <strong>{location}</strong>
        </Card.Subtitle>
        {location !== "Double Decker Lanes" ? (
          <div style={mapStyle} >
            {" "}
            Map
          </div>
        ) : null}
      </Card.Body>
    </Card>
  );
}
export default DayCard;
