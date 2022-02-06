'use strict'
const commonUtil = require('../common/commonUtil')
const Query = require('./query')
const { responseHeader: headers } = require('../common/responseUtil')

module.exports.handler = async function (event) {
  const { league, season } = event.pathParameters
  console.log('league :::', league)
  console.log('season :::', season)

  try {
    await commonUtil.connect()
    const result = await Query.readTopScorers(league, season)
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
      headers,
      statusCode: 500,
      body: e.message
    }
  }
}
