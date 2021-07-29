import { Badge, Card } from "react-bootstrap";
import { format, startOfDay, isEqual } from "date-fns";

function EmptyCard(props) {
  const theDay = props.data.day;
  const when = props.data.month;
  let bgc = "lightblue";
  if (when === "last" || when === "next") bgc = "lightgray";
  if (when === "current" && theDay === (new Date()).getDate()) {
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
        }}
        as="div"
      >
        <div
          style={{
            flex: "center",
          }}
          variant="light"
        > {bgc === "ivory" ? <span> TODAY </span> :""}
          {theDay}
        </div>
      </Card.Header>
    </Card>
  );
}
export default EmptyCard;
