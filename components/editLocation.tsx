import React, { useContext, useRef, useState } from "react"
import { useStoreContext } from "components/Store"

import { useForm } from "react-hook-form"
import { ErrorMessage } from "@hookform/error-message"

type FormValues = {
  name: string
  zip: string
  address: string
  city: string
  state: string
  phone: string
}

const EditLocation = (props) => {
  const { location, allLocations, doClose } = props

  const { updateLocation } = useStoreContext()

  const nextLocationId = () => {
    return (
      allLocations.reduce((max, l) => {
        return l.locationId > max ? l.locationId : max
      }, 0) + 1
    )
  }
  const {
    handleSubmit,
    register,
    watch,
    formState: { errors, isValid, isDirty },
  } = useForm<FormValues>({
    mode: "onBlur",
    defaultValues: {
      name: location.name,
      zip: location.zip,
      address: location.address,
      city: location.city,
      state: location.state,
      phone: location.phone,
    },
  })

  const onSubmit = (data, form) => {
    console.log("data", data)
    let theData = { ...data }
    theData.locationId = location.locationId ? location.locationId : nextLocationId()
    updateLocation(theData)
    doClose()

    console.log("good submit ", theData)
  }
  console.log("Location:", location, "errors", errors, "dirty", isDirty, "valid", isValid)
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form">
      <button className="btn btn-link" onClick={() => props.doClose()}>
        Back to Locations List
      </button>
      <div className="row">
        <label className="col-sm-1 col-form-label">Name</label>
        <div className="p-1 col-sm-3">
          <input
            {...register("name", { required: "This is required." })}
            placeholder="Enter Name"
            className="form-control"
          />
          <ErrorMessage
            errors={errors}
            name="name"
            render={({ message }) => {
              return <div className="text-bg-danger p-1">{message}</div>
            }}
          />
        </div>
        <label className="col-sm-1 col-form-label">Address</label>
        <div className="p-1 col-sm-3">
          <input {...register("address", { required: "This is required." })} placeholder="Enter Address" className="form-control" />
          <ErrorMessage
            errors={errors}
            name="address"
            render={({ message }) => {
              return <div className="text-bg-danger p-1">{message}</div>
            }}
          />
        </div>
        <label className="col-sm-1 col-form-label">City</label>
        <div className="p-1 col-sm-3">
          <input {...register("city", { required: "This is required." })} placeholder="Enter City" className="form-control" />
          <ErrorMessage
            errors={errors}
            name="city"
            render={({ message }) => {
              return <div className="text-bg-danger p-1">{message}</div>
            }}
          />
        </div>
        <label className="col-sm-1 col-form-label">State</label>
        <div className="p-1 col-sm-3">
          <input {...register("state", { required: "This is required." })} placeholder="Enter State" className="form-control" />
          <ErrorMessage
            errors={errors}
            name="state"
            render={({ message }) => {
              return <div className="text-bg-danger p-1">{message}</div>
            }}
          />
        </div>
        <label className="col-sm-1 col-form-label">Zip</label>
        <div className="p-1 col-sm-3">
          <input {...register("zip", { required: "This is required." })} placeholder="Enter Zipcode" className="form-control" />
          <ErrorMessage
            errors={errors}
            name="zip"
            render={({ message }) => {
              return <div className="text-bg-danger p-1">{message}</div>
            }}
          />
        </div>
        <label className="col-sm-1 col-form-label">Phone</label>
        <div className="p-1 col-sm-3">
          <input {...register("phone", { required: "This is required." })} placeholder="Phone number" className="form-control" />
          <ErrorMessage
            errors={errors}
            name="phone"
            render={({ message }) => {
              return <div className="text-bg-danger p-1">{message}</div>
            }}
          />
        </div>
      </div>

      <button type="submit" className="btn btn-primary" disabled={!isDirty || !isValid}>
        Submit
      </button>
    </form>
  )
}
export default EditLocation
