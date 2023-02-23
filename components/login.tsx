import React, { useState } from "react"
import { Form, Button, ButtonToolbar } from "react-bootstrap"
import * as Yup from "yup"
import { useStoreContext } from "./Store"
import { useForm } from "react-hook-form"
import type { SubmitHandler, DefaultValues } from "react-hook-form"
import { ErrorMessage } from "@hookform/error-message"
import { yupResolver } from "@hookform/resolvers/yup"

import Router from "next/router"

const SignupSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
})
type FormValues = {
  email: string
}

const defaultValues: DefaultValues<FormValues> = {
  email: "",
}

const Login = (props) => {
  const { doLoggin } = useStoreContext()

  const handleClose = () => {
    Router.push("/")
  }
  const {
    handleSubmit,
    register,
    getFieldState,
    setError,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    defaultValues,
    resolver: yupResolver(SignupSchema),
  })
  const onSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {
    const response = await fetch(
      `/api/getData?name=emailExists&email=${encodeURIComponent(data.email)}`
    )
    const myJson = await response.json()
    if (myJson.member === false) {
      setError("email", { message: "User Not found!!" }, { shouldFocus: true })
      return
    }
    const resp = await doLoggin(data.email)
    console.log(resp)
    if (resp) {
      data.email = ""
      Router.push("/")
      return
    } else {
      setError("email", { message: "User Not found!!" }, { shouldFocus: true })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form">
      <Form.Group controlId="email">
        <Form.Label>Email address</Form.Label>
        <Form.Control placeholder="Enter email" {...register("email")} />
        <ErrorMessage errors={errors} name="email" />
      </Form.Group>
      <ButtonToolbar className="justify-content-between">
        <Button variant="secondary" onClick={handleClose}>
          CANCEL
        </Button>
        <Button type="submit" disabled={getFieldState("email").isDirty && isValid ? false : true}>
          Submit
        </Button>
      </ButtonToolbar>
    </form>
  )
}

export default Login
