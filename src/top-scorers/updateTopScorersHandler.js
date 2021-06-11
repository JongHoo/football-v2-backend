'use strict';
const axios = require('axios')
const { isEmpty } = require('lodash')
const TopScorer = require('../models/topScorer')
const commonUtil = require('../common/commonUtil')
const apiMapper = require('../common/apiMapper')
const Query = require('./query')

module.exports.handler = async function (event) {
  const {season, league} = JSON.parse(event.body)
  let responseData = {}
  try {
    let {data} = await axios({
      method: 'get',
      url: 'https://api-football-v1.p.rapidapi.com/v3/players/topscorers',
      headers: {
        'x-rapidapi-host': 'api-football-v1.p.rapidapi.com',
        'x-rapidapi-key': 'dda81ea678msh94cace57ca66dc8p170996jsnca5b39b80f05',
        'useQueryString': true
      },
      params: {season, league: apiMapper.LEAGUE[league]}
    })

    if (!isEmpty(data.errors)) {
      console.log(data.errors)
      throw new Error('API error occur.')
    }

    responseData = data?.response
    if (isEmpty(responseData)) throw new Error('No data from API.')

    const newTopScorerList = []
    await commonUtil.connect()
    responseData.forEach(data => {
      const tempData = {
        leagueName: league,
        season: season,
        teamName: data.statistics[0].team.name,
        teamLogo: data.statistics[0].team.logo,
        name: data.player.name,
        age: data.player.age,
        nationality: data.player.nationality,
        photo: data.player.photo,
        appearances: data.statistics[0].games.appearances,
        lineups: data.statistics[0].games.lineups,
        minutes: data.statistics[0].games.minutes,
        position: data.statistics[0].games.position,
        goals: data.statistics[0].goals.total,
        assists: data.statistics[0].goals.assists,
        penalty: data.statistics[0].penalty.scored
      }
      const topScorerData = new TopScorer(tempData)
      newTopScorerList.push(topScorerData)
    })

    await Query.deleteTopScorers(league, season)
    console.log('Delete old Data Success')
    const insertedTopScorers = await Query.createTopScorers(newTopScorerList)
    console.log('Success! Data : ', insertedTopScorers)

    return {
      statusCode: 200,
      body: "Update Top Scorers Success!"
    }
  } catch (e) {
    return {
      statusCode: 200,
      body: e.message
    }
  }
}
