import Header from "../components/header";
function About() {
  let COMMIT_SHA = process.env.VERCEL_GITHUB_COMMIT_SHA;
  return (
    <>
      <Header />
      <h2>About whatever</h2>
      {COMMIT_SHA ? <h6>COMMIT_SHA</h6> : null} 
    </>
  );
}

export default About;
