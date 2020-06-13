import React, { useState } from "react";
import { Modal, Form, Button, ButtonToolbar } from "react-bootstrap";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useStoreContext } from "./Store";

const SignupSchema = Yup.object().shape({
  password: Yup.string().min(4, "Too Short!").required("Required"),
  email: Yup.string().email("Invalid email").required("Required"),
});

const Login = (props) => {
  const [failedLogin, setfailedLogin] = useState(false);
  const { doLoggin } = useStoreContext();

  const handleClose = () => {
    props.setShow(false);
  };

  const onSubmit = async (data) => {
    setfailedLogin(false);
    console.log("submitting", JSON.stringify(data));
    try {
      const resp = await doLoggin(data.email, data.password);

      console.log("onSubmit", resp);
      if (resp.code == "auth/user-not-found") {
        setfailedLogin(true);
      } else {
        handleClose();
      }
    } catch (e) {
      console.log("error in doLoggin", e);
    }
  };

  return (
    <Formik
      initialValues={{
        password: "",
        email: "",
      }}
      validationSchema={SignupSchema}
      onSubmit={async (values, { setSubmitting, setErrors, resetForm }) => {
        // same shape as initial values
        console.log(values);
        const resp = await doLoggin(values.email, values.password);
        console.log(resp);
        if (resp.user) {
          // try {
          //   const token = await resp.user.getIdToken();
          //   console.log(token);
          //   const response = await fetch(`http://localhost:8080/test`);
          //   const myJson = await response.json();
          //   console.log("resp", myJson);
          // } catch (e) {
          //   console.log("token error", e);
          // }
          delete values.email;
          delete values.password;
          props.setShow(false);
          return;
        } else {
          setErrors({ email: "User Not found!!" });
        }
      }}
    >
      {({
        handleSubmit,
        handleChange,
        handleBlur,
        values,
        touched,
        dirty,
        isValid,
        errors,
        submitForm,
        isSubmitting,
      }) => (
        <Modal show={props.showLogin} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Please Log In</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              {failedLogin && <Form.Text>Failed Login try again!</Form.Text>}
              <Form.Group controlId="email">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  name="email"
                  type="email"
                  placeholder="Enter email"
                  onChange={handleChange}
                  value={values.email}
                  onBlur={handleBlur}
                />

                <ErrorMessage
                  name="email"
                  component="div"
                  className="formError"
                />
              </Form.Group>
              <Form.Group controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  name="password"
                  type="password"
                  placeholder="Enter password"
                  onChange={handleChange}
                  value={values.password}
                  onBlur={handleBlur}
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="formError"
                />
              </Form.Group>
              <ButtonToolbar className="justify-content-between">
                <Button variant="secondary" onClick={handleClose}>
                  CANCEL
                </Button>
                <Button
                  type="submit"
                  disabled={dirty && isValid ? false : true}
                  onClick={handleSubmit}
                >
                  Submit
                </Button>
              </ButtonToolbar>
            </Form>
          </Modal.Body>
        </Modal>
      )}
    </Formik>
  );
};

export default Login;
