import React, { useContext, useState } from "react";
import moment from "moment";
import { useStoreContext } from "components/Store";
import { Formik, Field, ErrorMessage } from "formik";

import {
  Form,
  Button,
  Row,
  Col,
  InputGroup,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import * as Yup from "yup";

const schema = Yup.object().shape({
  name: Yup.string().required("Required"),
  houseName: Yup.string().matches(/^((?!Select House).)*$/),
});

const EditClub = (props) => {
  const { club, allClubs, doClose, locations } = props;
  

  const { updateClub } = useStoreContext();

  const nextClubId = () => {
    return (
      allClubs.reduce((max, l) => {
        return l.clubId > max ? l.clubId : max;
      }, 0) + 1
    );
    
  };

  const onSubmit = (data, form) => {
    console.log("data", data);
    let theData = { ...data };
    theData.clubId = club.name ? club.clubId : nextClubId();
    updateClub(theData);
    doClose();

    console.log("good submit ", theData);
  };
  const doHouseChange = (ev, values, setValues)  =>{
     
      const newLocation = props.locations.find(
        l => l.name === ev.target.value
      );
      
      setValues({
        ...newLocation,
        houseName: ev.target.value,
        name: values.name
      });
    
  };

  return (
    <Formik initialValues={club} onSubmit={onSubmit} validationSchema={schema}>
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
        setValues,
      }) => {
        console.log("date values", values);
        return (
          <Form>
            <Button variant="link" onClick={() => props.doClose()}>
              Back to Club List
            </Button>

            <Form.Group as={Row}>
              <Form.Label column sm={1}>
                Name
              </Form.Label>
              <Col sm={3}>
                <Form.Control
                  name="name"
                  type="text"
                  placeholder="Enter Name"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.name}
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="formError"
                />
              </Col>
              <Form.Label column sm={1}>
                Address
              </Form.Label>
              <Col sm={3}>
                <Form.Control
                  name="address"
                  type="text"
                  disabled
                  
                  value={values.address}
                />
                
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm={1}>
                City
              </Form.Label>
              <Col sm={3}>
                <Form.Control
                  name="city"
                  type="text"
                 disabled
                  value={values.city}
                />
                
              </Col>
              <Form.Label column sm={1}>
                House Name
              </Form.Label>
              <Col sm={3}>
              <Form.Control
                as="select"
                name="houseName"
                custom
                onChange={ev => doHouseChange(ev, values, setValues)}
                value={values.houseName}
              >
                {[{name:"Select House"}, ...locations].map((c, i) => {
                  return (
                    <option key={i} value={c.name}>
                      {c.name}
                    </option>
                  );
                })}
              </Form.Control>
                <ErrorMessage
                  name="houseName"
                  component="div"
                  className="formError"
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
                  disabled
                  value={values.phone}
                />
                
              </Col>
            </Form.Group>

            <Button
              type="submit"
              variant="primary"
              onClick={handleSubmit}
              disabled={!dirty || !isValid}
            >
              Submit
            </Button>
          </Form>
        );
      }}
      {/* */}
    </Formik>
  );
};
export default EditClub;
