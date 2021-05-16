const Standing = require('../models/standing')

module.exports.deleteStandings = (league, season) => {
  return Standing.deleteMany({leagueName: league, season: season})
}

module.exports.createStandings = (standingList) => {
  return Standing.create(standingList)
}

module.exports.readStandings = (league, season) => {
  return Standing.find()
    .where('leagueName').equals(league)
    .where('season').equals(season)
    .sort('position')
}

