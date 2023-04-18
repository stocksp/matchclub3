import React, { useContext, useState } from "react"
import { useStoreContext } from "components/Store"
import { Formik, Field, ErrorMessage } from "formik"

import { Form, Button, Row, Col, InputGroup, Tooltip } from "react-bootstrap"
import * as Yup from "yup"

const schema = Yup.object().shape({
  name: Yup.string().required("Required"),
  address: Yup.string().required("Required"),
  city: Yup.string().required("Required"),
  state: Yup.string().required("Required"),
  zip: Yup.string().required("Required"),
  phone: Yup.string().required("Required"),
})

const EditLocation = (props) => {
  const { location, allLocations, doClose } = props
  const [openAlert, setOpenAlert] = useState(false)

  const { updateLocation } = useStoreContext()

  const nextLocationId = () => {
    return (
      allLocations.reduce((max, l) => {
        return l.locationId > max ? l.locationId : max
      }, 0) + 1
    )
  }

  const onSubmit = (data, form) => {
    console.log("data", data)
    let theData = { ...data }
    theData.locationId = location.name ? location.locationId : nextLocationId()
    updateLocation(theData)
    doClose()

    console.log("good submit ", theData)
  }

  return (
    <Formik
      initialValues={
        location
          ? location
          : { name: "", address: "", city: "", state: "", zip: "", phone: "" }
      }
      onSubmit={onSubmit}
      validationSchema={schema}
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
      }) => {
        console.log("date values", values)
        return (
          <Form>
            <Button variant="link" onClick={() => props.doClose()}>
              Back to Locations List
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
                  placeholder="Enter address"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.address}
                />
                <ErrorMessage
                  name="address"
                  component="div"
                  className="formError"
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
                  placeholder="Enter City"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.city}
                />
                <ErrorMessage
                  name="city"
                  component="div"
                  className="formError"
                />
              </Col>
              <Form.Label column sm={1}>
                State
              </Form.Label>
              <Col sm={3}>
                <Form.Control
                  name="state"
                  type="text"
                  placeholder="Enter state"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.state}
                />
                <ErrorMessage
                  name="state"
                  component="div"
                  className="formError"
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Form.Label column sm={1}>
                Zip
              </Form.Label>
              <Col sm={3}>
                <Form.Control
                  name="zip"
                  type="text"
                  placeholder="Enter Zipcode"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.zip}
                />
                <ErrorMessage
                  name="zip"
                  component="div"
                  className="formError"
                />
              </Col>
              <Form.Label column sm={1}>
                Phone
              </Form.Label>
              <Col sm={3}>
                <Form.Control
                  name="phone"
                  type="text"
                  placeholder="Enter phone"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.phone}
                />
                <ErrorMessage
                  name="phone"
                  component="div"
                  className="formError"
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
        )
      }}
      {/* */}
    </Formik>
  )
}
export default EditLocation
