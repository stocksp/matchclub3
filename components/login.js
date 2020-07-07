import React, { useState } from "react";
import { Modal, Form, Button, ButtonToolbar } from "react-bootstrap";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useStoreContext } from "./Store";
import { useUser } from "libs/hooks";
import Router from 'next/router'

const SignupSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
});

const Login = (props) => {
  useUser({ redirectTo: "/", redirectIfFound: true });
  const [failedLogin, setfailedLogin] = useState(false);
  const { doLoggin } = useStoreContext();

  const handleClose = () => {
    setShowLogin(false);
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
          values.email = "";
          Router.push('/')
          return;
        } else {
          setErrors({ email: "User Not found!!" });
        }
      }}
      enableReinitialize={true}
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
      }) => {
        console.log("login Form render");
        return (
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
        );
      }}
    </Formik>
  );
};

export default Login;
