const mongoose = require('mongoose')

const topScorerSchema = new mongoose.Schema({
  leagueName: String,
  season: String,
  teamName: String,
  teamLogo: String,
  name: String,
  age: Number,
  nationality: String,
  photo: String,
  appearances: Number,
  lineups: Number,
  minutes: Number,
  position: String,
  goals: Number,
  assists: Number,
  penalty: Number
})

global.TopScorer = global.TopScorer || mongoose.model('TopScorer', topScorerSchema)
module.exports = global.TopScorer
