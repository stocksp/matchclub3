import { Badge, Card } from "react-bootstrap"
import Image from "next/image"
import { useDimensions } from "libs/useDimensions"
import { useRef } from "react"

function EmptyCard(props) {
  const ref = useRef(null)
  const { width, height } = useDimensions(ref)

  const theDay = props.data.day
  const when = props.data.month
  const day1 = props.day1
  const now = new Date()
  let bgc = "lightblue"
  if (when === "last" || when === "next") bgc = "lightgray"
  if (
    when === "current" &&
    theDay === now.getDate() &&
    day1.getMonth() === now.getMonth() &&
    day1.getFullYear() === now.getFullYear()
  ) {
    bgc = "ivory"
  }
  console.log("width", width, "height", height)
  if (bgc === "ivory")
    return (
      <Card>
        <Card.Header
          style={{
            padding: "0.1rem",
            backgroundColor: bgc,
            border: "0",
            cursor: "default",
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
          alt="what?"
          class={
            now.getDay() === 0 || now.getDay() === 6
              ? "img-fluid rounded-circle"
              : ""
          }
          fill={true}
          src={
            now.getHours() < 19 && now.getHours() > 6
              ? "/today.svg"
              : "/tonight.svg"
          }
        />
      </Card>
    )
  else
    return (
      <Card>
        <Card.Header
          style={{
            padding: "0.1rem",
            backgroundColor: bgc,
            border: "0",
            cursor: "default",
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
    )
}
export default EmptyCard
