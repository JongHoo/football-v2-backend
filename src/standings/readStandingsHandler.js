'use strict'
const commonUtil = require('../common/commonUtil')
const Query = require('./query')

module.exports.handler = async function (event) {
  const { league, season } = event.pathParameters
  console.log('league :::', league)
  console.log('season :::', season)

  try {
    await commonUtil.connect()
    const result = await Query.readStandings(league, season)
    if (!result?.length) {
      throw new Error('No Data.')
    }
    return {
      statusCode: 200,
      body: JSON.stringify(result)
    }
  } catch (e) {
    console.log('ERROR :::', e)
    return {
      statusCode: 500,
      body: e.message
    }
  }
}
