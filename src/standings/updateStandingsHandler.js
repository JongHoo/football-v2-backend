'use strict';
const axios = require('axios')
const { isEmpty } = require('lodash')
const Standing = require('../models/standing')
const commonUtil = require('../common/commonUtil')
const apiMapper = require('../common/apiMapper')
const Query = require('./query')

module.exports.handler = async function (event) {
  const {season, league} = JSON.parse(event.body)
  let responseData = {}
  try {
    let {data} = await axios({
      method: 'get',
      url: 'https://api-football-v1.p.rapidapi.com/v3/standings',
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

    responseData = data?.response?.[0]?.league?.standings?.[0]
    if (isEmpty(responseData)) throw new Error('No data from API.')

    const newStandingList = []
    await commonUtil.connect()
    responseData.forEach(data => {
      const tempData = {
        position: data.rank,
        teamName: data.team.name,
        teamLogo: data.team.logo,
        leagueName: league,
        season: season,
        win: data.all.win,
        draw: data.all.draw,
        lose: data.all.lose,
        played: data.all.played,
        scores: data.all.goals.for,
        conceded: data.all.goals.against,
        goalsDiff: data.goalsDiff,
        points: data.points
      }
      const standingData = new Standing(tempData)
      newStandingList.push(standingData)
    })

    await Query.deleteStandings(league, season)
    console.log('Delete old Data Success')
    const insertedStandings = await Query.createStandings(newStandingList)
    console.log('Success! Data : ', insertedStandings)
  } catch (e) {
    responseData = {
      message: e.message
    }
  }

  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*', // Required for CORS support to work
    },
    body: JSON.stringify(responseData),
  };

  return response;
}
