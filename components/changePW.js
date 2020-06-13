import React, { useState } from "react";
import { Modal, Form, Button, ButtonToolbar } from "react-bootstrap";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Router from "next/router";
import { useStoreContext } from "./Store";
import { firebase } from "libs/firebase";

const SignupSchema = Yup.object().shape({
  password: Yup.string().required("Required").min(4, "Too Short!"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords don't match!")
    .required("Required"),
});

const ChangePW = (props) => {
  const { pwChange } = useStoreContext();
  const handleClose = () => {
    props.setShow(false);
  };

  return (
    <Formik
      initialValues={{
        password: "",
        confirmPassword: "",
      }}
      validationSchema={SignupSchema}
      onSubmit={async (values, { setSubmitting, setErrors, resetForm }) => {
        // same shape as initial values
        console.log("password", values);
        const resp = await pwChange(props.member.email, values.password);

        props.setShow(false);
        await firebase.auth().signOut();
        await firebase
          .auth()
          .signInWithEmailAndPassword(
            `${props.member.email}`,
            values.password
          );
        Router.push(`/member/${props.member.memberId}`);
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
      }) => {
        console.log("dirty", dirty, "isValid", isValid);
        return (
          <Modal show={props.showPW} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Enter New Password</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <div className="text-center">
                  You will be logged out and in!
                </div>
                <Form.Group>
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    name="password"
                    type="password"
                    placeholder="Enter password"
                    onChange={handleChange}
                    value={values.password}
                    onBlur={handleBlur}
                    autoComplete="off"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="formError"
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Repeat Password</Form.Label>
                  <Form.Control
                    name="confirmPassword"
                    type="password"
                    placeholder="Repeat password"
                    onChange={handleChange}
                    value={values.confirmPassword}
                    onBlur={handleBlur}
                    autoComplete="off"
                  />
                  <ErrorMessage
                    name="confirmPassword"
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
        );
      }}
    </Formik>
  );
};

export default ChangePW;
