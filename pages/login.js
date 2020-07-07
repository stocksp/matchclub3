import { Container, Row, Col } from "react-bootstrap";
import Form from "components/login";
function Login() {
  return (
    <Container>
      <Row className="justify-content-center">
        <Col xs={12} sm={8} md={6} lg={4}>
          <h2 className="text-center">Log in</h2>
          <Form />
        </Col>
      </Row>
    </Container>
  );
}

export default Login;
