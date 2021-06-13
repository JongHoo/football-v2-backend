const Fixture = require('../models/fixture')

module.exports.deleteFixtures = (league, season) => {
  return Fixture.deleteMany({leagueName: league, season: season})
}

module.exports.createFixtures = (fixtureList) => {
  return Fixture.create(fixtureList)
}

module.exports.readFixturesByRound = (league, season, round) => {
  return Fixture.find()
    .where('leagueName').equals(league)
    .where('season').equals(season)
    .where('round').equals(round)
}

module.exports.readFixturesByTeam = (league, season, team) => {
  return Fixture.find()
    .where('leagueName').equals(league)
    .where('season').equals(season)
    .or([{homeTeam: team}, {awayTeam: team}])
}

