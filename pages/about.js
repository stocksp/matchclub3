import Header from "../components/header"
function About() {
  let COMMIT_SHA = process.env.buildId
  return (
    <>
      <Header />
      <h2>About</h2>
      <h6>Build: {COMMIT_SHA}</h6>
    </>
  )
}

export default About
