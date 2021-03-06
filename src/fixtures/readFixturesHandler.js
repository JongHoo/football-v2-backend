'use strict'
const commonUtil = require('../common/commonUtil')
const { responseHeader: headers } = require('../common/responseUtil')
const Query = require('./query')

module.exports.handler = async function (event) {
  const { league, season, option } = event.pathParameters
  console.log('league :::', league)
  console.log('season :::', season)
  console.log('option :::', option)

  try {
    await commonUtil.connect()
    const result = isNaN(option) ? await Query.readFixturesByTeam(league, season, decodeURI(option)) : await Query.readFixturesByRound(league, season, option)
    if (!result?.length) {
      throw new Error('No Data.')
    }
    return {
      headers,
      statusCode: 200,
      body: JSON.stringify(result)
    }
  } catch (e) {
    console.log('ERROR :::', e)
    return {
      headers,
      statusCode: 500,
      body: e.message
    }
  }
}
