const mongoose = require('mongoose')

let connection = null

const connect = async () => {
  if (connection && mongoose.connection.readyState === 1) return connection
  try {
    connection = await mongoose.connect('mongodb+srv://admin:dnjstnd1@freecluster-lbn7j.mongodb.net/football-v2?retryWrites=true', { useNewUrlParser: true })
    console.log('Atlas Connected!')
  } catch (err) {
    throw err
  }
}

const createResponse = (status, body) => ({
  statusCode: status,
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
  },
  body: JSON.stringify(body)
})

exports.connect = connect
exports.createResponse = createResponse
