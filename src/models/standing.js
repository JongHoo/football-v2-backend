const mongoose = require('mongoose')

const standingSchema = new mongoose.Schema({
  leagueName: String,
  season: String,
  teamName: String,
  teamLogo: String,
  position: Number,
  win: Number,
  draw: Number,
  lose: Number,
  points: Number,
  scores: Number,
  conceded: Number,
  played: Number,
  goalsDiff: Number
})

global.Standing = global.Standing || mongoose.model('Standing', standingSchema)
module.exports = global.Standing
