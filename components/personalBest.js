import Toast from "react-bootstrap/Toast"
import ToastContainer from "react-bootstrap/ToastContainer"
import React, { useState, useEffect, useRef } from "react"
import { useStoreContext } from "./Store"

const PersonalBest = (props) => {
  const [show, setShow] = useState(true)
  const showOff = () => {
    setShow(false)
    setDelay(null)
  }

  const { highScores, dateId } = useStoreContext()

  const [bests, setBests] = useState([])
  const [hasBests, setHasBests] = useState(false)
  const [bestCount, setBestCount] = useState(0)
  const [delay, setDelay] = useState(2500)

  useEffect(() => {
    console.log("best useEffects")
    getBests()
  }, [dateId])

  useInterval(() => {
    if (hasBests && bests.length > 0) {
      if (bestCount === bests.length - 1) setBestCount(0)
      else setBestCount(bestCount + 1)
    }
  }, 4000)

  const getBests = async () => {
    try {
      const response = await fetch(`/api/getData?name=getBests&dateId=${dateId}`)
      let myJson = await response.json()
      console.log("bests", myJson)
      setHasBests(true)
      setBests(myJson)
      setBestCount(0)
    } catch (e) {
      alert(`Sorry ${e}`)
    }
  }

  //console.log('bestCount', bestCount)
  if (highScores && highScores.dateResults.length > 0 && bests.length > 0) {
    const theBest = bests[bestCount]
    /* return (
            <ToastContainer className="p-3" position='middle-center'>
                <Toast show={show} onClose={showOff} >
                    <Toast.Header closeButton={true}>
                        <img
                            data-src="holder.js/20x20?text=%20"
                            className="rounded me-2"
                            alt=""
                        />
                        <strong className="me-auto">{theBest.alias}</strong>
                        +{theBest.plus}
                    </Toast.Header>
                    <Toast.Body>{`New high ${theBest.what}: ${theBest.value}`}</Toast.Body>
                </Toast>
            </ToastContainer>
        ); */
    return `${theBest.alias} new ${theBest.what} is ${theBest.value}`
  }
}
function useInterval(callback, delay) {
  const savedCallback = useRef()

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current()
    }
    if (delay !== null) {
      let id = setInterval(tick, delay)
      return () => clearInterval(id)
    }
  }, [delay])
}
export default PersonalBest
