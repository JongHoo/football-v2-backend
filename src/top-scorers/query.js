const TopScorer = require('../models/topScorer')

module.exports.deleteTopScorers = (league, season) => {
  return TopScorer.deleteMany({ leagueName: league, season: season })
}

module.exports.createTopScorers = (topScorerList) => {
  return TopScorer.create(topScorerList)
}

module.exports.readTopScorers = (league, season) => {
  return TopScorer.find()
    .where('leagueName').equals(league)
    .where('season').equals(season)
    .sort('rank')
}
