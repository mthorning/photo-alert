// https://app.ipgeolocation.io/
// https://metoffice.apiconnect.ibmcloud.com/metoffice/production/node/173
// https://english.api.rakuten.net/apihood/api/tides/pricing

require('dotenv').config()
const { format, addDays } = require('date-fns')
const getGeoTimes = require('./geo.js')
const getWeather = require('./weather.js')
const getTides = require('./tide.js')
const collate = require('./collate.js')
const makeHTML = require('./html.js')
const email = require('./email.js')

async function run() {
    const tomorrow = addDays(new Date(), 1)
    const geoData = await getGeoTimes(format(tomorrow, 'yyyy-MM-dd'))
    const weather = await getWeather()
    const tides = await getTides()
    const data = collate({ tides, geoData, weather, tomorrow })
    email(makeHTML(data))
}

run()
