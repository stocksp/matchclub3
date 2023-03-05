import React, { useState, useEffect } from "react"
import * as yup from "yup"
import { BsPlusCircleFill, BsDashCircleFill, BsFillInfoCircleFill } from "react-icons/bs"

import { OverlayTrigger, Tooltip } from "react-bootstrap"
import { useForm, Controller, useFieldArray } from "react-hook-form"
import { ErrorMessage } from "@hookform/error-message"
import { yupResolver } from "@hookform/resolvers/yup"

import { useStoreContext } from "components/Store"
import { fi } from "date-fns/locale"
type FormValues = {
  alias: string
  email: string
  first?: string
  last?: string
  address?: string
  city?: string
  zip?: number
  state?: string
  phone?: string
  cell?: string
  active: boolean
  guest: boolean
  memberId: number
  reminders: {
    value: number
  }[]
}

const theOptions = [1, 2, 3, 4, 5, 6, 7, 9, 11, 14, 21].map((n, i) => {
  return { label: `${n} day${n === 0 ? "" : "s"} before`, value: n }
})
const schema = yup.object().shape({
  alias: yup.string().min(2, "Too Short!").max(25, "Too Long!").required("Required"),
})

function EditMember(props) {
  
  const { member, members } = props
  const fromAdmin = props.fromAdmin ? true : false
  console.log("props", props, "fromAdmin", fromAdmin, "member:", member)
  const { updateMember } = useStoreContext()

  // only called by admin
  const nextMemberId = () => {
    return (
      props.allMembers.reduce((max, m) => {
        return m.memberId > max ? m.memberId : max
      }, 0) + 1
    )
  }
  const onSubmit = async (data, form) => {
    console.log("data", data)
    let theData
    // upsert: false don't allow adding new member!
    if (props.fromAdmin) {
      if (props.member.memberId)
        theData = { memberId: props.member.memberId, upsert: false, ...data }
      else theData = { memberId: nextMemberId(), upsert: true, ...data }
    } else {
      theData = { memberId: props.member.memberId, upsert: false, ...data }
    }
    // delete properties we don't want for now no email change except new member
    if (!props.fromAdmin && !props.member.memberId) {
      delete theData.email
    }
    delete theData._id
    // reminders
    theData.reminders = data.reminders.map(d => d.value)
    /* if (!props.fromAdmin) {
      delete theData.active;
      delete theData.guest;
    } */
    // is member becoming a quest?
    if (!props.member.guest && data.guest) {
      theData.terminate = true
    } else if (props.member.guest && !data.guest) {
      theData.add = true
    }
    // TODO check return here for aok!!!
    await updateMember(theData)
    // in admin we have to update the members array AND we have allMembers
    //clear termination and add
    delete theData.terminate
    delete theData.add

    if (!props.fromAdmin) {
      props.setMember(theData)
    } else {
      // find the element
      const i = props.allMembers.findIndex((m) => m.memberId === props.memberId)
      if (i == -1) {
        // just add it
        props.allMembers.push(theData)
      } else {
        props.allMembers[i] = { ...props.allMembers[i], ...data }
      }
    }
    reset(
      (formValues) => ({
        ...formValues,
      }),
      { keepDirty: false }
    )

    console.log("good submit ", theData)
  }
  const {
    control,
    handleSubmit,
    register,
    getValues,
    reset,

    formState: { errors, isValid, isDirty },
  } = useForm<FormValues>({
    mode: "onBlur",
    defaultValues: {
      alias: props.member.alias,
      first: props.member.first?.trim(),
      email: props.member.email.trim(),
      last: props.member.last?.trim(),
      address: props.member.address?.trim(),
      state: props.member.state?.trim(),
      city: props.member.city?.trim(),
      zip: props.member.zip,
      phone: props.member.phone?.trim(),
      cell: props.member.cell?.trim(),
      active: props.member.active,
      guest: props.member.guest,
      memberId: props.member.memberId,
      reminders: props.member.reminders.map((v) => ({ value: v })),
    },
    resolver: yupResolver(schema),
  })
  const { fields, append, remove } = useFieldArray({
    control,
    name: "reminders",
  })
  console.log("props", fromAdmin, props, "fields", fields)
  register("memberId")
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form">
      <>
        <button type="submit" className="btn btn-primary" disabled={!isDirty || !isValid}>
          Submit
        </button>
        {fromAdmin && (
          <button className="btn btn-link" onClick={() => props.doClose()}>
            Back to Club List
          </button>
        )}

        <div className="row">
          <label className="col-sm-1 input-group-text col-form-label">Alias</label>
          <div className="p-1 col-sm-2">
            <input {...register("alias")} placeholder="Enter Alias" className="form-control" />
            <ErrorMessage errors={errors} name="alias" />
          </div>
          {props.fromAdmin ? (
            <>
              <label className="col-sm-1 input-group-text col-form-label">Email</label>
              <div className="p-1 col-sm-3">
                <input
                  {...register("email")}
                  placeholder="Email Address"
                  className="form-control"
                />
              </div>
            </>
          ) : (
            <>
              <label className="col-sm-1 input-group-text col-form-label">Email</label>
              <div className="p-1 col-sm-3">
                <div className="input-group ">
                  <span
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    data-bs-custom-class="custom-tooltip"
                    data-bs-title="Contact Don or Cap:<br />To change email!"
                    data-bs-html="true"
                    className="input-group-text"
                  >
                    <BsFillInfoCircleFill size={"1.5em"} style={{ cursor: "pointer" }} />
                  </span>
                  <input
                    {...register("email")}
                    placeholder="Email Address"
                    className="form-control"
                    disabled
                  />
                </div>
              </div>
            </>
          )}
        </div>
        <div className="row">
          <label className="col-sm-1 input-group-text col-form-label">First</label>
          <div className="p-1 col-sm-2">
            <input {...register("first")} placeholder="Enter First Name" className="form-control" />
          </div>
          <label className="col-sm-1 input-group-text col-form-label">Last</label>
          <div className="p-1 col-sm-2">
            <input {...register("last")} placeholder="Enter Last Name" className="form-control" />
          </div>
        </div>
        <div className="row">
          <label className="col-sm-1 input-group-text col-form-label">Address</label>
          <div className="p-1 col-sm-2">
            <input {...register("address")} placeholder="Enter Address" className="form-control" />
          </div>
          <label className="col-sm-1 input-group-text col-form-label">City</label>
          <div className="p-1 col-sm-2">
            <input {...register("city")} placeholder="Enter City" className="form-control" />
          </div>
        </div>
        <div className="row">
          <label className="col-sm-1 input-group-text col-form-label">State</label>
          <div className="p-1 col-sm-2">
            <input {...register("state")} placeholder="Enter State" className="form-control" />
          </div>
          <label className="col-sm-1 input-group-text col-form-label">Zip</label>
          <div className="p-1 col-sm-2">
            <input {...register("zip")} placeholder="Enter Zipcode" className="form-control" />
          </div>
        </div>
        <div className="row">
          <label className="col-sm-1 input-group-text col-form-label">Phone</label>
          <div className="p-1 col-sm-2">
            <input {...register("phone")} placeholder="Enter Phone" className="form-control" />
          </div>
          <label className="col-sm-1 input-group-text col-form-label">Cell</label>
          <div className="p-1 col-sm-2">
            <input {...register("cell")} placeholder="Enter Cell Phone" className="form-control" />
          </div>
        </div>
        {fields.map((field, index) => {
          return (
            <div className="row" key={index}>
              <label className="col-sm-1 input-group-text col-form-label">{`Reminder ${
                index + 1
              }`}</label>
              <div className="col-sm-3">
                <div className="input-group">
                  <select {...register(`reminders.${index}.value`)} className="form-control">
                    {theOptions.map((o, i) => {
                      return (
                        <option key={i} value={o.value}>
                          {o.label}
                        </option>
                      )
                    })}
                  </select>

                  {fields.length != 0 && (
                    <div
                    style={{ cursor: "pointer" }}
                      className="ms-3"
                      onClick={(e) => {
                        remove(index)
                      }}
                    >
                      <span className="pe-2">Delete</span>
                      <BsDashCircleFill size={"2em"} color={"red"} style={{ cursor: "pointer" }} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
        {fields.length < 2 && (
          <div onClick={(e) => append({ value: 7 })}>
            Click to add a second email reminder&nbsp;&nbsp;
            <BsPlusCircleFill size={"2em"} color={"blue"} style={{ cursor: "pointer" }} />
          </div>
        )}
        {fromAdmin && (
          <>
            <label className="col-sm-2 input-group-text form-check-label">Active</label>
            <div className="px-2 col-sm-3 form-check form-switch">
              <input
                className="ms-2 mt-2 form-check-input"
                type="checkbox"
                {...register("active")}
              />
            </div>
            <label className="col-sm-2 input-group-text form-check-label">Guest</label>
            <div className="px-2 col-sm-3 form-check form-switch">
              <input
                className="ms-2 mt-2 form-check-input"
                type="checkbox"
                {...register("guest")}
              />
            </div>
          </>
        )}
      </>
    </form>
  )
  /*       <Formik
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
                  {props.fromAdmin ? (
                    <Form.Control
                      name="email"
                      type="text"
                      placeholder="Enter email"
                      value={values.email}
                      onChange={handleChange}
                    />
                  ) : (
                    <InputGroup>
                      <InputGroup.Text>
                        {" "}
                        <OverlayTrigger
                          placement="right"
                          delay={{ show: 250, hide: 400 }}
                          overlay={renderTooltip}
                        >
                          <div>
                            <BsFillInfoCircleFill
                              size={"1.5em"}
                              style={{ cursor: "pointer" }}
                            />
                          </div>
                        </OverlayTrigger>
                      </InputGroup.Text>
                      <Form.Control
                        name="email"
                        type="text"
                        placeholder="Enter email"
                        value={values.email}
                        onChange={handleChange}
                        disabled
                      />
                    </InputGroup>
                  )}
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
                            <div style={{ width: "20%" }}>
                              <OverlayTrigger
                                placement="right"
                                delay={{ show: 250, hide: 400 }}
                                overlay={reminderTooltip}
                              >
                                <div style={{ display: "inline" }}>
                                  <BsDashCircleFill
                                    size={"2em"}
                                    color={"red"}
                                    onClick={() => {
                                      remove(i);
                                    }}
                                    style={{ cursor: "pointer" }}
                                  />
                                </div>
                              </OverlayTrigger>
                            </div>
                          )}
                          {values.reminders.length < 2 && (
                            <div>
                              Click to add a second email reminder&nbsp;&nbsp;
                              <BsPlusCircleFill
                                size={"2em"}
                                color={"blue"}
                                onClick={() => {
                                  push(1);
                                }}
                                style={{ cursor: "pointer" }}
                              />
                            </div>
                          )}
                        </Form.Group>
                      );
                    });
                  else
                    return (
                      <div>
                        Click to add an email reminder&nbsp;&nbsp;
                        <div style={{ display: "inline" }}>
                          <BsPlusCircleFill
                            size={"2em"}
                            color={"blue"}
                            onClick={() => {
                              push(1);
                            }}
                            style={{ cursor: "pointer" }}
                          />
                        </div>
                      </div>
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
      </Formik> */
}

export default EditMember
