import React, { useRef } from "react"

import { useStoreContext } from "components/Store"
//
import * as Yup from "yup"
import { useForm } from "react-hook-form"
import { ErrorMessage } from "@hookform/error-message"
import { yupResolver } from "@hookform/resolvers/yup"

const schema = Yup.object().shape({
  name: Yup.string().required("Required"),
  houseName: Yup.string().matches(/^((?!Select House).)*$/),
  address: Yup.string(),
  phone: Yup.string(),
  city: Yup.string(),
})
type FormValues = {
  name: string
  houseName: string
  address: string
  city: string
  phone: string
}

const EditClub = (props) => {
  const { allClubs, doClose, locations } = props
  const club = useRef(props.club)

  const { updateClub } = useStoreContext()

  const nextClubId = () => {
    return (
      allClubs.reduce((max, l) => {
        return l.clubId > max ? l.clubId : max
      }, 0) + 1
    )
  }
  const {
    watch,
    handleSubmit,
    register,
    getValues,
    setValue,
    trigger,
    formState: { errors, isValid, isDirty },
  } = useForm<FormValues>({
    mode: "onChange",
    
    defaultValues: {
      name: club.current.name,
      houseName: club.current.houseName,
      address: club.current.address,
      city: club.current.city,
      phone: club.current.phone,
    },
    //resolver: yupResolver(schema),
  })

  const { onChange, onBlur, name, ref } = register("houseName")

  const onSubmit = (data, form) => {
    console.log("data", data, "club", club.current)
    let theData = { ...club.current, ...data }
    theData.clubId = club.current.clubId ? club.current.clubId : nextClubId()
    updateClub(theData)
    doClose()

    console.log("good submit ", theData)
  }
  const doHouseChange = (ev) => {
    console.log("new house name", ev.target.value, "club", club)
    const newLocation = props.locations.find((l) => l.name === ev.target.value)
    club.current = {
      ...newLocation,
      ...club.current,
      houseName: ev.target.value,
      name: getValues("name"),
    }
    console.log("updated club", club.current)
    setValue("address", club.current.address)
    setValue("phone", club.current.phone)
    setValue("city", club.current.city)
    //await trigger()

    console.log("club now", club)
  }
  const validateName = (value: string, which: string) => {
    if (which === "name" && value === "") return "Must have a name!"
    if (which === "house" && value.match(/^((?!Select House).)*$/)) return "Must Select a House"
    return true
  }

  console.log("Club:", club.current, "errors", errors, "dirty", isDirty, "valid", isValid)
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form">
      <button className="btn btn-link" onClick={() => props.doClose()}>
        Back to Club List
      </button>
      <div className="row">
        <label className="col-sm-1 col-form-label">Name</label>
        <div className="p-1 col-sm-3">
          <input
            {...register("name", { validate: (value) => validateName(value, "name") })}
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
        <label className="col-sm-2 col-form-label">Address</label>
        <div className="col-sm-3">
          <input {...register("address")} disabled className="form-control" />
        </div>
      </div>
      <div className="row">
        <label className="col-sm-1 col-form-label">City</label>
        <div className="p-1 col-sm-3">
          <input {...register("city")} disabled className="form-control" />
        </div>
        <label className="p-1 col-sm-2 col-form-label">House Name</label>
        <div className="col-sm-3">
          <select
            onChange={(e) => {
              doHouseChange(e)
              onChange(e)
            }}
            onBlur={(e) => {
              onBlur(e)
            }}
            name={name}
            ref={ref}
            className="form-control"
          >
            {[{ name: "Select House" }, ...locations].map((c, i) => {
              return (
                <option key={i} value={c.name}>
                  {c.name}
                </option>
              )
            })}
          </select>
          <ErrorMessage
            errors={errors}
            name="houseName"
            render={({ message }) => {
              return <div className="text-bg-danger p-1">{message}</div>
            }}
          />
        </div>
      </div>
      <div className="row">
        <label className="col-sm-1 col-form-label">Phone</label>
        <div className="p-1 col-sm-3">
          <input
            disabled
            {...register("phone")}
            placeholder="Enter Name"
            className="p-1 form-control"
          />
        </div>
      </div>
      <button type="submit" className="btn btn-primary" disabled={!isDirty || !isValid}>
        Submit
      </button>
    </form>
  )
  {
    /* <Formik initialValues={club} onSubmit={onSubmit} validationSchema={schema}>
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

            
          </Form>
        );
      }}
   
    </Formik> */
  }
}
export default EditClub
