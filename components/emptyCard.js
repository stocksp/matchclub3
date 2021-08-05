import { Badge, Card } from "react-bootstrap";
import { format, startOfDay, isEqual } from "date-fns";

function EmptyCard(props) {
  const theDay = props.data.day;
  const when = props.data.month;
  const day1 = props.day1;
  const now = new Date();
  let bgc = "lightblue";
  if (when === "last" || when === "next") bgc = "lightgray";
  if (
    when === "current" &&
    theDay === now.getDate() &&
    day1.getMonth() === now.getMonth() &&
    day1.getFullYear() === now.getFullYear()
  ) {
    bgc = "ivory";
  }
  return (
    <Card>
      <Card.Header
        style={{
          padding: "0.1rem",
          backgroundColor: bgc,
          cursor: "pointer",
          display: "flex",
          justifyContent: "flex-end",
          height: "100%",
        }}
        as="div"
      >
        <div
          style={{
            height: "90px",
            flex: "center",
          }}
          variant="light"
        >
          {" "}
          {bgc === "ivory" ? <span> TODAY </span> : ""}
          {theDay}
        </div>
      </Card.Header>
    </Card>
  );
}
export default EmptyCard;
