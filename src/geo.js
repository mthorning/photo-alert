const request = require('./utils/request.js')

const geoKey = process.env.GEO_KEY
const {
    config: { latitude, longitude },
} = require('../package.json')

module.exports = function getGeoTimes(date) {
    return request({
        name: 'geo',
        url: `https://api.ipgeolocation.io/astronomy?apiKey=${geoKey}&lat=${Number(
            latitude
        ).toFixed(4)}&long=${Number(longitude).toFixed(4)}&date=${date}`,
        options: {
            headers: {
                accept: 'application/json',
            },
        },
    })
}
