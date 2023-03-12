import React, { useState } from "react"

import { format } from "date-fns"

import * as yup from "yup"
import { ErrorMessage } from "@hookform/error-message"
import { yupResolver } from "@hookform/resolvers/yup"
import { useForm, useFieldArray } from "react-hook-form"
import toast, { Toaster } from "react-hot-toast"
import { isInteger } from "formik"
const notify = () =>
  toast("Update Good!", {
    duration: 4000,
    position: "top-center",
    // Styling
    style: {},
    className: "",
    // Custom Icon
    icon: "👏",
    // Change colors of success/error/loading icon
    iconTheme: {
      primary: "#000",
      secondary: "#fff",
    },
    // Aria
    ariaProps: {
      role: "status",
      "aria-live": "polite",
    },
  })

const schema = yup.object().shape({
  squad: yup.array().of(
    yup.object().shape({
      games: yup.array().of(
        yup
          .number("Not a number")
          .transform((v) => {
            //console.log("type", typeof v)
            return isNaN(v) || v === 0 ? 0 : v
          })
          .integer()
          .moreThan(-1, "No Negatives!")
          .lessThan(301, "Really!?")
      ),
    })
  ),
  won: yup.number().integer().moreThan(-1, "No Negatives!").lessThan(5, "4 or less"),
  lost: yup.number().integer().moreThan(-1, "No Negatives!").lessThan(5, "4 or less"),
})
type MCDate = {
  date: Date
  guest: string
  host: string
  location: string
  season: string
  dateId: number
  teamsizemax: number
  squad: Array<any>
  hasmeeting: boolean
}
type Bowler = {
  name: string
  pos: number
  id: number
  games: number[]
  series?: number
}
type Squad = Array<Bowler>
type Scores = {
  dateId: number
  squad: Squad
  won: number
  lost: number
}
// date is actually dateId
type FormValues = {
  date: number
  squad: Squad
  won: number
  lost: number
}
interface FromStore {
  hasDates: boolean
  dates: MCDate[]
  setActive: any
  scores: Scores[]
  hasScores: boolean
  getScores: any
  updateScores: any
}
function EditGames(props: { dates: MCDate[]; scores: Scores[]; updateScores: any }) {
  const { dates, scores, updateScores } = props
  const [dateId, setDateId] = useState(dates[0].dateId)

  const calcScores = (dateId: number) => {
    let data = scores.find((s: Scores) => s.dateId === dateId)
    data.squad.sort((a, b) => {
      const a1 = a.name.split(" ").slice(-1)[0]
      const b1 = b.name.split(" ").slice(-1)[0]
      if (a1 < b1) return -1
      if (a1 > b1) return 1
      return 0
    })
    // add series
    data.squad.forEach((b) => {
      b.series = b.games.reduce((a, b) => a + (b ? b : 0), 0)
    })
    return data
  }

  async function onSubmit(values) {
    // same shape as initial values
    //console.log("all the data ", values)
    //return
    const scores = []
    const dateId = values.dateId
    const date = dates.find((d) => d.dateId === dateId)
    const match = `${date.host}-${date.guest}`
    const season = date.season

    values.squad.forEach((s) => {
      if (!s.games.includes(0)) {
        const games = s.games
        scores.push({
          games,
          dateId,
          match,
          season,
          memberId: s.id,
          alias: s.name,
          date: values.date.date,
        })
      }
    })
    console.log("submit", dateId, match, season, scores, values.won, values.lost)

    const resp = await updateScores(dateId, match, season, scores, values.won, values.lost)
    console.log("respons", resp)
    if (resp.message === "aok") {
      // clear dirty so submit is disabled
      reset({ ...values })
      notify()
    } else {
      toast.error("Somethin went wrong with the update!!")
    }
  }

  const {
    handleSubmit,
    register,
    control,
    setValue,
    getValues,
    reset,
    formState: { errors, isValid, isDirty },
  } = useForm<FormValues>({
    mode: "onBlur",
    defaultValues: calcScores(dateId),
    resolver: yupResolver(schema),
  })
  const { fields } = useFieldArray({
    name: "squad",
    control,
  })
  const handleDateChange = (event) => {
    const val = parseInt(event.target.value)
    const theScores = calcScores(val)
    setDateId(val)
    setValue("date", val)
    setValue("won", theScores.won)
    setValue("lost", theScores.lost)
    setValue("squad", theScores.squad)
  }
  const doseries = (index: number) => {
    let data = getValues(`squad.${index}.games`)

    const series = data.reduce((a, b) => {
      //console.log(`squad.${index}.games`, getValues(`squad.${index}.games`))
      console.log("a,b", a, b, a + b)
      return a + b
    }, 0)
    setValue(`squad.${index}.series`, series)
  }
  const validateGame = (value: number) => {
    const val = !isNaN(value) && Number.isInteger(value) && value < 300 && value > -1
    console.log("value", value, val)
    return val
  }
  const { onChange, onBlur, name, ref } = register("date")
  console.log("theScores", getValues(), errors)
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <div className="row">
          <Toaster
            containerStyle={{
              position: "relative",
            }}
          />
          <div className="col-sm-2">
            <label className="form-label">Select the Match Date</label>
          </div>
          <div className="p-2 col-sm-2">
            <button type="submit" className="btn btn-primary" disabled={!isDirty || !isValid}>
              Submit
            </button>
          </div>
        </div>
        <div className="col-sm-4">
          <select
            onChange={(e) => {
              handleDateChange(e)
              onChange(e)
            }}
            onBlur={onBlur}
            name={name}
            ref={ref}
            className="form-control"
          >
            {dates.map((d: MCDate, i) => {
              const title = `${format(d.date, "MMM. d, yyyy")} ${d.host} hosting ${d.guest}`
              return (
                <option key={i} value={d.dateId}>
                  {title}
                </option>
              )
            })}
          </select>
        </div>

        <div className="row">
          <label className="col-sm-1 input-group-text col-form-label">Won</label>
          <div className="p-1 col-sm-2">
            <input {...register("won")} placeholder="Enter Won" className="form-control" />
            <ErrorMessage errors={errors} name="won" />
          </div>
          <label className="col-sm-1 input-group-text col-form-label">Lost</label>
          <div className="p-1 col-sm-2">
            <input {...register("lost")} placeholder="Enter Lost" className="form-control" />
            <ErrorMessage errors={errors} name="lost" />
          </div>
        </div>
        <table className="table table-striped table-bordered table-hover table-sm">
          <thead>
            <tr>
              <th>Bowler</th>
              <th>Game&nbsp;1</th>
              <th>Game&nbsp;2</th>
              <th>Game&nbsp;3</th>
              <th>Series</th>
            </tr>
          </thead>
          <tbody>
            {fields.map((field, index) => {
              return (
                <tr key={field.id}>
                  <td key={1}>{field.name}</td>
                  <td key={2}>
                    <input
                      key={field.id}
                      {...register(`squad.${index}.games.0` as const, {
                        valueAsNumber: true,
                      })}
                      onBlur={(e) => {
                        doseries(index)
                        onBlur(e)
                      }}
                    />
                    <div>
                      <ErrorMessage errors={errors} name={`squad.${index}.games.0`} />
                    </div>
                  </td>
                  <td key={3}>
                    <input
                      key={field.id}
                      {...register(`squad.${index}.games.1` as const, {
                        valueAsNumber: true,
                        validate: (value) => validateGame(value),
                      })}
                      onBlur={(e) => {
                        doseries(index)
                        onBlur(e)
                      }}
                    />
                    <div>
                      <ErrorMessage errors={errors} name={`squad.${index}.games.1`} />
                    </div>
                  </td>
                  <td key={4}>
                    <input
                      key={field.id}
                      {...register(`squad.${index}.games.2` as const, { valueAsNumber: true })}
                      onBlur={(e) => {
                        doseries(index)
                        onBlur(e)
                      }}
                    />
                    <div>
                      <ErrorMessage errors={errors} name={`squad.${index}.games.2`} />
                    </div>
                  </td>
                  <td key={5}>
                    <input
                      key={field.id}
                      {...register(`squad.${index}.series` as const)}
                      disabled
                    />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </form>
    </>
  )
}

export default EditGames
