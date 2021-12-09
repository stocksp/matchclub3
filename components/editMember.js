import React, { useState, useEffect } from "react";
import * as yup from "yup";
import {
  BsPlusCircleFill,
  BsDashCircleFill,
  BsFillInfoCircleFill,
} from "react-icons/bs";
import { Formik, FieldArray, ErrorMessage } from "formik";
import {
  Button,
  Form,
  Row,
  Col,
  InputGroup,
  OverlayTrigger,
  Tooltip,
  Image
} from "react-bootstrap";

import { useStoreContext } from "components/Store";

function renderTooltip(props) {
  return (
    <Tooltip id="button-tooltip" {...props}>
      Contact Cap to change email!
    </Tooltip>
  );
}

const theOptions = [1, 2, 3, 4, 5, 6, 7, 9, 11, 14, 21].map((n, i) => {
  return { label: `${n} day${n === 0 ? "" : "s"} before`, value: n };
});
const schema = yup.object().shape({
  alias: yup
    .string()
    .min(2, "Too Short!")
    .max(15, "Too Long!")
    .required("Required"),
});

function EditMember(props) {
  const { updateMember } = useStoreContext();
  let ref = React.createRef();

  const [active, setActive] = useState(
    props.member ? props.member.active : true
  );
  const [guest, setGuest] = useState(props.member ? props.member.guest : false);
  // only called by admin
  const nextMemberId = () => {
    return (
      props.allMembers.reduce((max, m) => {
        return m.memberId > max ? m.memberId : max;
      }, 0) + 1
    );
  };
  const onSubmit = async (data, form) => {
    console.log("data", data);
    let theData;
    // upsert: false don't allow adding new member!
    if (props.fromAdmin) {
      if (props.member.memberId)
        theData = { memberId: props.member.memberId, upsert: false, ...data };
      else theData = { memberId: nextMemberId(), upsert: true, ...data };
    } else {
      theData = { memberId: props.member.memberId, upsert: false, ...data };
    }
    // delete properties we don't want for now no email change except new member
    if (!props.fromAdmin && !props.member.memberId) {
      delete theData.email;
    }
    delete theData._id;
    /* if (!props.fromAdmin) {
      delete theData.active;
      delete theData.guest;
    } */
    // is member becoming a quest?
    if (!props.member.guest && data.guest) {
      theData.terminate = true;
    } else if (props.member.guest && !data.guest) {
      theData.add = true;
    }
    // TODO check return here for aok!!!
    await updateMember(theData);
    // in admin we have to update the members array AND we have allMembers
    //clear termination and add
    delete theData.terminate;
    delete theData.add;

    if (!props.fromAdmin) {
      props.setMember(data);
    } else {
      // find the element
      const i = props.allMembers.findIndex(
        (m) => m.memberId === props.memberId
      );
      if (i == -1) {
        // just add it
        props.allMembers.push(theData);
      } else {
        props.allMembers[i] = { ...props.allMembers[i], ...data };
      }
    }
    form.resetForm({ values: data });

    console.log("good submit ", theData);
  };
  return (
    <>
      <Formik
        initialValues={props.member}
        onSubmit={onSubmit}
        validationSchema={schema}
        enableReinitialize={true}
      >
        {({
          handleSubmit,
          handleChange,
          handleBlur,
          values,
          errors,
          touched,
          dirty,
          isValid,
          setFieldValue,
          setStatus,
          status,
        }) => {
          console.log("member values", values, errors, touched);
          return (
            <Form>
              <Button
                type="submit"
                variant="primary"
                disabled={(!dirty || !isValid) && status !== "shit"}
                onClick={handleSubmit}
              >
                Submit
              </Button>{" "}
              {props.fromAdmin && (
                <Button variant="link" onClick={() => props.doClose()}>
                  Back to Members List
                </Button>
              )}
              <Form.Group as={Row}>
                <Form.Label column sm={1}>
                  alias
                </Form.Label>
                <Col sm={3}>
                  <Form.Control
                    name="alias"
                    type="text"
                    placeholder="Enter alias"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.alias}
                  />
                  <ErrorMessage
                    name="alias"
                    component="div"
                    className="formError"
                  />
                </Col>
                <Form.Label column sm={1}>
                  Email
                </Form.Label>
                <Col sm={3}>
                  <InputGroup>
                    <InputGroup.Text>
                      {" "}
                      <BsFillInfoCircleFill
                        size={"1.5em"}
                        style={{ cursor: "pointer" }}
                      />
                    </InputGroup.Text>
                    <Form.Control
                      name="email"
                      type="text"
                      placeholder="Enter email"
                      value={values.email}
                      disabled
                    />
                  </InputGroup>
                </Col>
              </Form.Group>
              <Form.Group as={Row}>
                <Form.Label column sm={1}>
                  First
                </Form.Label>
                <Col sm={3}>
                  <Form.Control
                    name="first"
                    type="text"
                    placeholder="Enter first name"
                    onChange={handleChange}
                    value={values.first}
                  />
                </Col>
                <Form.Label column sm={1}>
                  Last
                </Form.Label>
                <Col sm={3}>
                  <Form.Control
                    name="last"
                    type="text"
                    placeholder="Enter last name"
                    onChange={handleChange}
                    value={values.last}
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row}>
                <Form.Label column sm={1}>
                  Address
                </Form.Label>
                <Col sm={3}>
                  <Form.Control
                    name="address"
                    type="text"
                    placeholder="Enter address"
                    onChange={handleChange}
                    value={values.address}
                  />
                </Col>
                <Form.Label column sm={1}>
                  City
                </Form.Label>
                <Col sm={3}>
                  <Form.Control
                    name="city"
                    type="text"
                    placeholder="Enter City"
                    onChange={handleChange}
                    value={values.city}
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row}>
                <Form.Label column sm={1}>
                  State
                </Form.Label>
                <Col sm={3}>
                  <Form.Control
                    name="state"
                    type="text"
                    placeholder="Enter state"
                    onChange={handleChange}
                    value={values.state}
                  />
                </Col>
                <Form.Label column sm={1}>
                  Zip
                </Form.Label>
                <Col sm={3}>
                  <Form.Control
                    name="zip"
                    type="text"
                    placeholder="Enter zip code"
                    onChange={handleChange}
                    value={values.zip}
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row}>
                <Form.Label column sm={1}>
                  Phone
                </Form.Label>
                <Col sm={3}>
                  <Form.Control
                    name="phone"
                    type="text"
                    placeholder="Enter phone"
                    onChange={handleChange}
                    value={values.phone}
                  />
                </Col>
                <Form.Label column sm={1}>
                  Cell
                </Form.Label>
                <Col sm={3}>
                  <Form.Control
                    name="cell"
                    type="text"
                    placeholder="Enter cell"
                    onChange={handleChange}
                    value={values.cell}
                  />
                </Col>
              </Form.Group>
              <FieldArray name="reminders">
                {({ move, swap, push, insert, unshift, pop, remove }) => {
                  if (values.reminders && values.reminders.length > 0)
                    return values.reminders.map((s, i) => {
                      return (
                        <Form.Group as={Row} key={i}>
                          <Form.Label column sm={2}>
                            Reminder {i + 1}
                          </Form.Label>
                          <Col sm={2}>
                            <Form.Control
                              name={`reminders.${i}`}
                              as="select"
                              onChange={(v) => {
                                setFieldValue(
                                  `reminders.${i}`,
                                  parseInt(v.target.value)
                                );
                              }}
                              style={{ width: "100%" }}
                              value={s}
                            >
                              {theOptions.map((o, i) => {
                                return (
                                  <option key={i} value={o.value}>
                                    {o.label}
                                  </option>
                                );
                              })}
                            </Form.Control>
                          </Col>
                          {values.reminders.length != 0 && (
                            <BsDashCircleFill
                              size={"2em"}
                              color={"red"}
                              onClick={() => {
                                remove(i);
                              }}
                              style={{ cursor: "pointer" }}
                            />
                          )}
                          {values.reminders.length < 2 && (
                            <BsPlusCircleFill
                              size={"2em"}
                              color={"blue"}
                              onClick={() => {
                                push(1);
                              }}
                              style={{ cursor: "pointer" }}
                            />
                          )}
                        </Form.Group>
                      );
                    });
                  else
                    return (
                      <BsPlusCircleFill
                        size={"2em"}
                        color={"blue"}
                        onClick={() => {
                          push(1);
                        }}
                        style={{ cursor: "pointer" }}
                      />
                    );
                }}
              </FieldArray>
              {props.fromAdmin && (
                <Form.Check
                  id="active"
                  type="switch"
                  name="active"
                  label="Active"
                  onChange={() => {
                    setActive(!active);
                    setFieldValue("active", !active);
                  }}
                  checked={active}
                />
              )}
              {props.fromAdmin && (
                <Form.Check
                  id="guest"
                  type="switch"
                  name="guest"
                  label="Guest"
                  onChange={() => {
                    setGuest(!guest);
                    setFieldValue("guest", !guest);
                  }}
                  checked={guest}
                />
              )}
            </Form>
          );
        }}
      </Formik>
    </>
  );
}

export default EditMember;
