import React from "react"

import { BsTypeBold } from "react-icons/bs"
import { getDay, getDaysInMonth, addMonths, format } from "date-fns"

function startOfSeason() {
  const now = new Date()
  var month = now.getMonth() + 1
  var year = now.getFullYear()

  if (month > 0 && month < 9) year -= 1
  return new Date(`08/30/${year}`)
}
function getSeason(date = new Date()) {
  var month = date.getMonth() + 1
  var year = date.getFullYear()

  if (month > 0 && month < 9) year -= 1
  return `${year - 2000}-${year - 1999}`
}
// from an array matchScores calc the average
function calcStats(scores: Array<Score>): MemberStat {
  // saving this maybe handicaps can be added with
  // reduce ...
  /* let totalGames = scores.reduce((a, b) => a + b.games.length, 0);
  let totalPins = scores.reduce(
    (a, b) => a + b.games.reduce((a, b) => a + b, 0),
    0
  );
  let hiGame = scores.reduce((a, b) => Math.max(a, ...b.games),0);
  let hiSeries = scores.reduce((a, b) =>
    Math.max(a, b.games.reduce((a, b) => a + b, 0)),0
  );
  let average = Math.floor(totalPins / totalGames); */
  let average = 0
  let hiGame = 0
  let hiSeries = 0
  let totalGames = 0
  let totalPins = 0
  let hiGameHandi = 0
  let hiSeriesHandi = 0
  let hiSeriesGames = []
  let hiSeriesHandiGames = []
  let handicap = 0
  scores.forEach((s) => {
    const hg = Math.max(...s.games)
    const ser = s.games.reduce((a, b) => a + b, 0)
    //const param = `${s.dateId.toString()}-${s.memberId.toString()}`;
    totalPins += ser
    totalGames += s.games.length
    let handi = Math.floor(0.9 * Math.floor(220 - Math.floor(totalPins / totalGames)))
    // no negative handicap for bowlers over 220
    if (handi < 0) {
      handi = 0
    }
    if (hg > hiGame) hiGame = hg
    if (ser > hiSeries) {
      hiSeries = ser
      hiSeriesGames = s.games
    }
    if (hg + handi > hiGameHandi) hiGameHandi = hg + handi
    if (ser + 3 * handi > hiSeriesHandi) {
      hiSeriesHandi = ser + 3 * handi
      hiSeriesHandiGames = s.games
    }

    handicap = handi
  })
  average = Math.floor(totalPins / totalGames)
  return {
    average,
    hiGame,
    hiSeries,
    totalGames,
    totalPins,
    hiSeriesGames,
    hiSeriesHandiGames,
    hiSeriesHandi,
    hiGameHandi,
    handicap,
    season: getSeason(),
    memberId: scores[0].memberId,
    member: scores[0].alias,
  }
}
function computePersonalBest(
  previousScores: Array<Score>,
  stats: MemberStat,
  dateId: number
) {
  let average = 0
  let hiGame = 0
  let hiSeries = 0
  let totalGames = 0
  let totalPins = 0
  const data = []
  previousScores.forEach((s) => {
    const hg = Math.max(...s.games)
    const ser = s.games.reduce((a, b) => a + b, 0)
    totalPins += ser
    totalGames += s.games.length

    if (hg > hiGame) hiGame = hg
    if (ser > hiSeries) {
      hiSeries = ser
    }
  })
  average = Math.floor(totalPins / totalGames)

  if (stats.average - average > 0) {
    data.push({
      updateOne: {
        filter: { season: stats.season, memberId: stats.memberId, dateId: dateId },
        update: {
          $set: {
            alias: previousScores[0].alias,
            what: "average",
            plus: stats.average - average,
            value: stats.average,
          },
        },
        upsert: true,
      },
    })
  }
  if (stats.hiGame - hiGame > 0) {
    data.push({
      updateOne: {
        filter: { season: stats.season, memberId: stats.memberId, dateId: dateId },
        update: {
          $set: {
            alias: previousScores[0].alias,
            what: "hiGame",
            plus: stats.hiGame - hiGame,
            value: stats.hiGame,
          },
        },
        upsert: true,
      },
    })
  }
  if (stats.hiSeries - hiSeries > 0) {
    data.push({
      updateOne: {
        filter: { season: stats.season, memberId: stats.memberId, dateId: dateId },
        update: {
          $set: {
            alias: previousScores[0].alias,
            what: "hiSeries",
            plus: stats.hiSeries - hiSeries,
            value: stats.hiSeries,
          },
        },
        upsert: true,
      },
    })
  }

  return data
}
// compute the members handicap for the whole season
// this is not efficient but its quick ....
async function makeHandi(db) {
  const scores = await db
    .collection("matchScores")
    .find({ season: getSeason(new Date()) })
    .sort({ date: 1 })
    .toArray()
  const memberIds: Array<number> = scores.map((s: Score) => s.memberId)
  // make unique (no duplicate) ids
  const memIds: Array<number> = [...new Set(memberIds)]
  memIds.sort((a, b) => a - b)
  console.log(memIds)
  const handiObj = {} as HandiObject
  memIds.forEach((m) => {
    const theScores = scores.filter((s) => s.memberId === m)

    let totalPins = 0
    let gamesTotal = 0
    const propArray = []
    const handiArr = []
    theScores.forEach((s, i) => {
      const series = s.games.reduce((acc, cur) => acc + cur, 0)
      totalPins += series
      gamesTotal += s.games.length
      let handi = Math.floor(0.9 * Math.floor(220 - Math.floor(totalPins / gamesTotal)))
      // no negative handicap for bowlers over 220
      if (handi < 0) {
        handi = 0
      }
      handiArr.push(handi)
      propArray.push(`${s.dateId.toString()}-${s.memberId}`)
    })
    propArray.forEach((item, index) => {
      handiObj[item] = handiArr[index === 0 ? index : index - 1]
    })
  })
  handiObj.season = getSeason(new Date())
  console.log(handiObj)
  let res = await db
    .collection("handicaps")
    .updateOne({ season: getSeason(new Date()) }, { $set: handiObj }, { upsert: true })
  console.log("write handi obj ", res.result)
  return handiObj
}
function makeHighScores(scoreArray: Array<Score>, handi) {
  const highScores = {} as HighScores
  // high game Scratch
  scoreArray.sort((a, b) => {
    const h1 = Math.max(...a.games)
    const h2 = Math.max(...b.games)
    return h2 - h1
  })
  // grab top 3
  let hi = scoreArray.slice(0, 3)
  const hiGScratch = hi.map((s) => {
    return { alias: s.alias, score: Math.max(...s.games).toString() }
  })
  highScores.scratchGame = hiGScratch
  // high series scratch
  scoreArray.sort((a, b) => {
    const h1 = a.games.reduce((acc, cur) => acc + cur, 0)
    const h2 = b.games.reduce((acc, cur) => acc + cur, 0)
    return h2 - h1
  })
  hi = scoreArray.slice(0, 3)
  const hiSerScratch = hi.map((s) => {
    return {
      alias: s.alias,
      score:
        s.games.reduce((acc, cur) => acc + cur, 0).toString() + " (" + s.games.join(", ") + ")",
    }
  })
  highScores.scratchSeries = hiSerScratch
  // high game handi
  scoreArray.sort((a, b) => {
    const h1 = Math.max(...a.games) + handi[`${a.dateId.toString()}-${a.memberId}`]
    const h2 = Math.max(...b.games) + handi[`${b.dateId.toString()}-${b.memberId}`]
    return h2 - h1
  })
  hi = scoreArray.slice(0, 3)
  const hiGameHandi = hi.map((s) => {
    return {
      alias: s.alias,
      score:
        (Math.max(...s.games) + handi[`${s.dateId.toString()}-${s.memberId}`]).toString() +
        " +" +
        handi[`${s.dateId.toString()}-${s.memberId}`],
    }
  })
  highScores.handiGame = hiGameHandi
  // high series handi
  scoreArray.sort((a, b) => {
    const h1 =
      a.games.reduce((acc, cur) => acc + cur, 0) + 3 * handi[`${a.dateId.toString()}-${a.memberId}`]
    const h2 =
      b.games.reduce((acc, cur) => acc + cur, 0) + 3 * handi[`${b.dateId.toString()}-${b.memberId}`]
    return h2 - h1
  })
  hi = scoreArray.slice(0, 3)
  const hiSeriesHandi = hi.map((s) => {
    return {
      alias: s.alias,
      score:
        (
          s.games.reduce((acc, cur) => acc + cur, 0) +
          3 * handi[`${s.dateId.toString()}-${s.memberId}`]
        ).toString() +
        " (" +
        s.games.join(", ") +
        ") +" +
        3 * handi[`${s.dateId.toString()}-${s.memberId}`],
    }
  })
  highScores.handiSeries = hiSeriesHandi

  return highScores
}

// make array of array to feed
// table tr and td used in Sqaud and printing
const makeChunks = (arr, size) => {
  const chunks = []
  arr.forEach((item) => {
    if (!chunks.length || chunks[chunks.length - 1].length === size) chunks.push([])
    chunks[chunks.length - 1].push(item)
  })
  return chunks
}

// search dates collection to see if the given
// day has a match
function findDate(dates, year, month, day) {
  const found = dates.find(
    (d) => d.date.getFullYear() === year && d.date.getMonth() === month && d.date.getDate() === day
  )
  return found
}
/*
// this is a date object from the db
date:Sun Aug 22 2021 13:00:00 GMT-0700 (Pacific Daylight Time)
dateId:334
guest:'Double Decker'
hasmeeting:false
host:'Continental'
location:'Double Decker Lanes'
season:'20-21'
teamsizemax:16
*/
// startDay is Sunday = 0  through Saturday = 6
// lastMonthDays is the ending day of last month
// We need these if the 1st does not fall on Sunday
// so we show the last days of last month in the first week
function getFirstWeek(startDay, lastMonthDays, dates, curDate) {
  const week = []
  const curMonth = curDate.getMonth()
  const curYear = curDate.getFullYear()
  const lastMonth = addMonths(curDate, -1).getMonth()
  // not last year but the year of last month
  const lastYear = addMonths(curDate, -1).getFullYear()
  // no days from last month
  if (startDay === 0) {
    for (let x = 1; x < 8; x++) {
      const found = findDate(dates, curYear, curMonth, x)
      if (found) week.push({ day: x, month: "current", date: found })
      else week.push({ day: x, month: "current" })
    }
    return week
  }
  let start = lastMonthDays - startDay + 1
  // days from the previous month starting the calendar
  for (let x = start; x <= lastMonthDays; x++) {
    const found = findDate(dates, lastYear, lastMonth, x)
    if (found) week.push({ day: x, month: "last", date: found })
    else week.push({ day: x, month: "last" })
  }
  // remaining days in the week which are for the current month
  for (let x = 1; week.length < 7; x++) {
    const found = findDate(dates, curYear, curMonth, x)
    if (found) week.push({ day: x, month: "current", date: found })
    else week.push({ day: x, month: "current" })
  }
  return week
}
// end day is the last day number of the previous week
// daysInMonth are just that and we have to fill out the week
// starting at 1 for next month if our last day doesn't fall
// on Saturday
function getNextWeek(endDay, daysInMonth, dates, curDate) {
  const week = []
  const curMonth = curDate.getMonth()
  const curYear = curDate.getFullYear()
  const nextMonth = addMonths(curDate, 1).getMonth()
  // not next year but the year of next month
  const nextYear = addMonths(curDate, 1).getFullYear()
  for (let x = endDay + 1, start = 1; week.length < 7; x++) {
    const found = dates.find(
      (d) =>
        d.date.getFullYear() === (x <= daysInMonth ? curYear : nextYear) &&
        d.date.getMonth() === (x <= daysInMonth ? curMonth : nextMonth) &&
        d.date.getDate() === x
    )
    if (x <= daysInMonth) {
      if (found) week.push({ day: x, month: "current", date: found })
      else week.push({ day: x, month: "current" })
    } else {
      if (found) week.push({ day: start++, month: "next", date: found })
      else week.push({ day: start++, month: "next" })
    }
  }
  return week
}

export {
  startOfSeason,
  getSeason,
  makeHandi,
  calcStats,
  makeHighScores,
  makeChunks,
  getFirstWeek,
  getNextWeek,
  computePersonalBest,
}
