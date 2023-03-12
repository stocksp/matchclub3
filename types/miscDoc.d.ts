type Score = {
  alias: string
  date: Date
  dateId: number
  games: Array<number>
  match: string
  memberId: number
  season: string
  member: string
  memberId: number
}
type HandiObject = {
  [key: string]: number
  season: string
}
type HighScore = {
  alias: string
  score: string
}
type HighScores = {
  scratchGame: Array<HighScore>
  scratchSeries: Array<HighScore>
  handiGame: Array<HighScore>
  handiSeries: Array<HighScore>
}
type MemberStat = {
  average: number
  hiGame: number
  hiSeries: number
  totalGames: number
  totalPins: number
  hiSeriesGames: number[]
  hiSeriesHandiGames: number[]
  hiSeriesHandi: number
  hiGameHandi: number
  handicap: number
  season: string
  memberId: number
  member: string
}
