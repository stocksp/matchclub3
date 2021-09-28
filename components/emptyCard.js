import { Badge, Card } from "react-bootstrap";
import { format, startOfDay, isEqual } from "date-fns";
import Image from "next/image";

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
  if (bgc === "ivory")
    return (
      <Card>
        <Card.Header
          style={{
            padding: "0.1rem",
            backgroundColor: bgc,
            border: "0",
            cursor: "pointer",
            display: "flex",
            justifyContent: "flex-end",
            height: "28px",
          }}
          as="div"
        >
          <div
            style={{
              flex: "top",
            }}
            variant="light"
          >
            {theDay}
          </div>
        </Card.Header>
        <Image
          height="50%"
          width="100%"
          src={
            now.getHours() < 19 && now.getHours() > 6
              ? "/today.svg"
              : "/tonight.svg"
          }
        />
      </Card>
    );
  else
    return (
      <Card>
        <Card.Header
          style={{
            padding: "0.1rem",
            backgroundColor: bgc,
            border: "0",
            cursor: "pointer",
            display: "flex",
            justifyContent: "flex-end",
            height: "28px",
          }}
          as="div"
        >
          <div
            style={{
              flex: "top",
            }}
            variant="light"
          >
            {theDay}
          </div>
        </Card.Header>
        <Card.Body
          style={{
            backgroundColor: bgc,
            height: "62px",
            padding: "0px 0px 0px 0px",
          }}
          as="div"
        ></Card.Body>
      </Card>
    );
}
export default EmptyCard;
