import React, { useState } from "react"
import { Form, Button, ButtonToolbar } from "react-bootstrap"
import { Magic } from "magic-sdk"

import { useAtom } from "jotai"
import { userAtom } from "jotai/user"
import { useForm } from "react-hook-form"
//import type { SubmitHandler, DefaultValues } from "react-hook-form"
import { ErrorMessage } from "@hookform/error-message"

import Router from "next/router"

const defaultValues = {
  email: "",
}

const Login = () => {
  const [user, setUser] = useAtom(userAtom)
  const handleClose = () => {
    Router.push("/")
  }
  const {
    handleSubmit,
    register,
    getFieldState,
    setError,
    formState: { errors, isValid },
  } = useForm(defaultValues)
  const onSubmit = async (data) => {
    const response = await fetch(
      `/api/getData?name=emailExists&email=${encodeURIComponent(data.email.toLowerCase())}`
    )
    const myJson = await response.json()
    if (myJson.member === false) {
      setError("email", { message: "User Not found!!" }, { shouldFocus: true })
      return
    }
    const resp = await login(data.email.toLowerCase())
    console.log(resp)
    if (resp) {
      setUser(resp.user)
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
        <Form.Control
          placeholder="Enter email"
          {...register("email", {
            pattern: {
              value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
              message: "Not valid email address",
            },
          })}
        />
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
  async function login(email) {
    console.log("logging in from user login")
    const body = {
      email: email,
    }
    
    try {
      const didToken = await new Magic(
        process.env.NEXT_PUBLIC_MAGIC_PUB_KEY
      ).auth.loginWithMagicLink({ email })
      const authResponse = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + didToken,
        },
        body: JSON.stringify(body),
      })
      console.log("authRequest", authResponse)
      if (authResponse.ok) {
        console.log("we have logged in!")
        console.log("authRequest", authResponse)
        setUser(authResponse.user)
        return true
      } else {
        return false
      }
    } catch (error) {
      console.log("doLoggin failed", error)
      return error
    }
    return
  }
}

export default Login
