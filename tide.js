const fetch = require('node-fetch')

const {
  config: { latitude, longitude },
} = require('./package.json')

function onError(details) {
  console.error('tide network error: ', details)
  process.exit(3)
}

module.exports = function getTides() {
  return fetch(
    `https://tides.p.rapidapi.com/tides?latitude=${latitude}&longitude=${longitude}`,
    {
      headers: {
        'x-rapidapi-host': 'tides.p.rapidapi.com',
        'x-rapidapi-key': process.env.TIDE_KEY,
        useQueryString: true,
        accept: 'application/json',
      },
    }
  )
    .then((response) => {
      if (!response.ok) onError(response)

      return response.json()
    })
    .then(console.log)
    .catch((error) => onError(error))
}
