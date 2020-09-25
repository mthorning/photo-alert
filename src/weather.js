const request = require('./utils/request.js')

const metID = process.env.MET_ID
const metSecret = process.env.MET_SECRET
const {
    config: { latitude, longitude },
} = require('../package.json')

module.exports = function getWeather() {
    return request({
        name: 'weather',
        url: `https://api-metoffice.apiconnect.ibmcloud.com/metoffice/production/v0/forecasts/point/hourly?latitude=${latitude}&longitude=${longitude}`,
        options: {
            headers: {
                accept: 'application/json',
                'x-ibm-client-secret': metSecret,
                'x-ibm-client-id': metID,
            },
        },
    })
}
