const mongoose = require('mongoose')

const fixtureSchema = new mongoose.Schema({
  leagueName: String,
  season: String,
  date: String,
  round: Number,
  homeTeam: String,
  homeTeamLogo: String,
  homeTeamGoals: Number,
  awayTeam: String,
  awayTeamLogo: String,
  awayTeamGoals: Number
})

global.Fixture = global.Fixture || mongoose.model('Fixture', fixtureSchema)
module.exports = global.Fixture
