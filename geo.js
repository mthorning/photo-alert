const fetch = require('node-fetch')

const geoKey = process.env.GEO_KEY
const {
  config: { latitude, longitude },
} = require('./package.json')

function onError(details) {
  console.error('geo network error: ', details)
  process.exit(1)
}

module.exports = function getGeoTimes(date) {
  return fetch(
    `https://api.ipgeolocation.io/astronomy?apiKey=${geoKey}&lat=${Number(
      latitude
    ).toFixed(4)}&long=${Number(longitude).toFixed(4)}&date=${date}`,
    {
      headers: {
        accept: 'application/json',
      },
    }
  )
    .then((response) => {
      if (!response.ok) onError(response)

      return response.json()
    })
    .catch((error) => onError(error))
}
