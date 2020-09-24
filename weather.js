const fetch = require('node-fetch')

const metID = process.env.MET_ID
const metSecret = process.env.MET_SECRET
const {
  config: { latitude, longitude },
} = require('./package.json')

function onError(details) {
  console.error('weather network error: ', details)
  process.exit(2)
}

module.exports = function getWeather() {
  return fetch(
    `https://api-metoffice.apiconnect.ibmcloud.com/metoffice/production/v0/forecasts/point/hourly?latitude=${latitude}&longitude=${longitude}`,
    {
      headers: {
        accept: 'application/json',
        'x-ibm-client-secret': metSecret,
        'x-ibm-client-id': metID,
      },
    }
  )
    .then((response) => {
      if (!response.ok) onError(response)

      return response.json()
    })
    .catch((error) => onError(error))
}
