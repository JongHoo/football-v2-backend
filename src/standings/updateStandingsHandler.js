'use strict';
const axios = require('axios')
const { isEmpty } = require('lodash')

module.exports.handler = async function(event) {
  // ligue 1 61
  // serie A 135
  // PL 39
  // Bundesliga 78 
  // Eredivisie 88
  // La Liga 140
  let responseData = {}
  try {
    let { data } = await axios({
      method: 'get',
      url: 'https://api-football-v1.p.rapidapi.com/v3/standings',
      headers: {
        'x-rapidapi-host': 'api-football-v1.p.rapidapi.com',
        'x-rapidapi-key': 'dda81ea678msh94cace57ca66dc8p170996jsnca5b39b80f05',
        'useQueryString': true
      },
      params: {
        season: '2020',
        league: '39'
      }
    })
    responseData = data?.response?.[0]?.league?.standings?.[0]
    if (isEmpty(responseData)) throw new Error('No data from API.')
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
