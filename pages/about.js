import Header from "../components/header"
function About() {
  let COMMIT_SHA = process.env.buildId
  return (
    <>
      <Header />
      <h2>About whatever</h2>
      <h6>Build: {COMMIT_SHA}</h6>
      <form action="https://dev.skeletonforms.com/api/formPost?key=10001" method="POST">
        <label>
          Your email address:
          <input type="email" name="email" />
        </label>
        <br />
        <label>
          Your message:
          <textarea name="message"></textarea>
        </label>
        <br />
        <button type="submit">Send</button>
      </form>
    </>
  )
}

export default About
