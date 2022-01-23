'use strict'
const axios = require('axios')
const { isEmpty } = require('lodash')
const Fixture = require('../models/fixture')
const commonUtil = require('../common/commonUtil')
const apiMapper = require('../common/apiMapper')
const Query = require('./query')

module.exports.handler = async function (event) {
  const { season, league } = JSON.parse(event.body)
  console.log('league :::', league)
  console.log('season :::', season)
  let responseData = {}
  try {
    const { data } = await axios({
      method: 'get',
      url: 'https://api-football-v1.p.rapidapi.com/v3/fixtures',
      headers: {
        'x-rapidapi-host': 'api-football-v1.p.rapidapi.com',
        'x-rapidapi-key': 'dda81ea678msh94cace57ca66dc8p170996jsnca5b39b80f05',
        useQueryString: true
      },
      params: { season, league: apiMapper.LEAGUE[league] }
    })

    if (!isEmpty(data.errors)) {
      console.log(data.errors)
      throw new Error('API error occur.')
    }

    responseData = data?.response
    if (isEmpty(responseData)) throw new Error('No data from API.')

    const newFixtureList = []
    await commonUtil.connect()
    responseData.forEach(data => {
      let round = data.league.round.split(' ').pop()
      // FIXME: 승강 라운드 처리 필요 (임시로 마지막 라운드+1 처리 함)
      if (league === 'BUNDESLIGA' && isNaN(round)) {
        round = 35
      } else if (league === 'LIGUE1' && isNaN(round)) {
        round = 39
      }
      const tempData = {
        leagueName: league,
        season: season,
        date: data.fixture.date,
        round: round,
        homeTeam: data.teams.home.name,
        homeTeamLogo: data.teams.home.logo,
        homeTeamGoals: data.goals.home,
        awayTeam: data.teams.away.name,
        awayTeamLogo: data.teams.away.logo,
        awayTeamGoals: data.goals.away
      }
      const fixtureData = new Fixture(tempData)
      newFixtureList.push(fixtureData)
    })

    await Query.deleteFixtures(league, season)
    console.log('Delete old Data Success')
    const insertedFixtures = await Query.createFixtures(newFixtureList)
    console.log('Success! Data Length: ', insertedFixtures.length)

    return {
      statusCode: 200,
      body: 'Update Fixtures Success!'
    }
  } catch (e) {
    console.log('ERROR :::', e)
    return {
      statusCode: 200,
      body: e.message
    }
  }
}
