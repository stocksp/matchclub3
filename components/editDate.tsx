import React, { useContext, useState } from "react"

import { isSameDay } from "date-fns"
import { useStoreContext } from "components/Store"

import { getSeason } from "libs/utils"
import Alert from "components/alert"
import DatePicker from "react-datepicker"

import { useForm, Controller } from "react-hook-form"
import { ErrorMessage } from "@hookform/error-message"

type FormValues = {
  date: Date
  guest: string
  host: string
  location: string
  teamsizemax: number
  hasmeeting: boolean
  squad?: Array<any>
  dateId?: number
  season?: string
}

const EditDate = (props) => {
  const [openAlert, setOpenAlert] = useState(false)

  const { updateDate, dates } = useStoreContext()
  // get existing dates to exclude in datepicker
  const theDates = dates.map((d) => d.date)
  const teamSizeMaxArr = [16, 20]

  const { clubs, locations } = props.clubsLocations

  // check that the edited (or not) date does not fall on an existing date
  // ignore the case where the date is compared to itself
  const dateIsUsed = (date) => {
    return props.dates.some((d) => {
      const same = isSameDay(date, d.date)
      return same && d.dateId !== props.date.dateId
    })
  }
  const nextDateId = () => {
    return (
      props.dates.reduce((max, d) => {
        return d.dateId > max ? d.dateId : max
      }, 0) + 1
    )
  }
  const {
    control,
    handleSubmit,
    register,
    getValues,
    setValue,

    formState: { errors, isValid, isDirty },
  } = useForm<FormValues>({
    defaultValues: {
      date: props.date.date,
      guest: props.date.guest.trim(),
      host: props.date.host.trim(),
      location: props.date.location.trim(),
      teamsizemax: props.date.teamsizemax,
      hasmeeting: props.date.hasmeeting,
    },
  })
  console.log("props.date", props.date)
  const onSubmit = (data, form) => {
    const conflict = dateIsUsed(data.date)
    console.log("conflict with existing date", conflict)
    if (conflict) setOpenAlert(true)
    else {
      //let theData = {}

      const theData: FormValues = {
        dateId: props.date.dateId ? props.date.dateId : nextDateId(),
        guest: data.guest,
        host: data.host,
        location: data.location,
        teamsizemax: data.teamsizemax,
        date: data.date.toJSON(),
        hasmeeting: data.hasmeeting,
        season: getSeason(data.date),
        squad: props.date.squad,
      }

      updateDate(theData)
      //form.resetForm({ values: data })
      console.log("done with submit TODO", theData)
      props.doClose()
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form">
      <button className="btn btn-link" onClick={() => props.doClose()}>
        Back to Club List
      </button>
      <div className="row pb-1">
        <label className="col-sm-2 input-group-text col-form-label">Date</label>
        <div className="p-1 col-sm-3">
          <Controller
            control={control}
            name="date"
            render={({ field: { value, ...fieldProps } }) => {
              return (
                <DatePicker
                  {...fieldProps}
                  className="ms-2 input form-control"
                  placeholderText="Select date"
                  showTimeSelect
                  selected={value}
                  dateFormat="MMM d, yyyy h:mm aa"
                  excludeDates={theDates}
                />
              )
            }}
          />
        </div>
      </div>

      <div className="row pb-1">
        <label className="col-sm-2 input-group-text col-form-label">
          Host Club
        </label>
        <div className="col-sm-3">
          <select {...register("host")} className="form-control">
            {[{ name: "Select Club" }, ...clubs].map((c, i) => {
              const name = c.name.trim()
              return (
                <option key={i} value={name}>
                  {name}
                </option>
              )
            })}
          </select>
        </div>
      </div>
      <div className="row pb-1">
        <label className="col-sm-2 input-group-text col-form-label">
          Guest Club
        </label>
        <div className="col-sm-3">
          <select {...register("guest")} className="form-control">
            {[{ name: "Select Club" }, ...clubs].map((c, i) => {
              const name = c.name.trim()
              return (
                <option key={i} value={name}>
                  {name}
                </option>
              )
            })}
          </select>
        </div>
      </div>
      <div className="row pb-1">
        <label className="col-sm-2 input-group-text col-form-label">
          Location
        </label>
        <div className="col-sm-3">
          <select {...register("location")} className="form-control">
            {[{ name: "Select House" }, ...locations].map((c, i) => {
              const name = c.name.trim()
              return (
                <option key={i} value={name}>
                  {name}
                </option>
              )
            })}
          </select>
        </div>
      </div>
      <div className="row pb-1">
        <label className="col-sm-2 input-group-text col-form-label">
          Squad Size
        </label>
        <div className="col-sm-3">
          <select {...register("teamsizemax")} className="form-control">
            {teamSizeMaxArr.map((c, i) => {
              return (
                <option key={i} value={c}>
                  {c}
                </option>
              )
            })}
          </select>
        </div>
      </div>
      <div className="row pb-1">
        <label className="col-sm-2 input-group-text form-check-label">
          Has Meeting
        </label>
        <div className="px-2 col-sm-3 form-check form-switch">
          <input
            className="ms-2 mt-2 form-check-input"
            type="checkbox"
            {...register("hasmeeting")}
          />
        </div>
      </div>
      <button
        type="submit"
        className="btn btn-primary"
        disabled={!isDirty || !isValid}
      >
        Submit
      </button>
    </form>
  )
}
export default EditDate
