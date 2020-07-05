import React, { useState } from "react";
import { Modal, Form, Button, ButtonToolbar } from "react-bootstrap";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useStoreContext } from "./Store";

const SignupSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
});

const Login = (props) => {
  const [failedLogin, setfailedLogin] = useState(false);
  const { doLoggin } = useStoreContext();

  const handleClose = () => {
    props.setShow(false);
  };

  return (
    <Formik
      initialValues={{
        email: "",
      }}
      validationSchema={SignupSchema}
      onSubmit={async (values, { setSubmitting, setErrors, resetForm }) => {
        // same shape as initial values
        console.log(values);
        const resp = await doLoggin(values.email);
        console.log(resp);
        if (resp) {
          delete values.email;

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
