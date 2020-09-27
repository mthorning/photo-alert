const { differenceInMinutes } = require('date-fns')
const request = require('./utils/request.js')

const metID = process.env.MET_ID
const metSecret = process.env.MET_SECRET
const {
    config: { latitude, longitude },
} = require('../package.json')

function fetchWeather(resolve) {
    request({
        name: 'data-weather',
        url: `https://api-metoffice.apiconnect.ibmcloud.com/metoffice/production/v0/forecasts/point/hourly?latitude=${latitude}&longitude=${longitude}`,
        options: {
            headers: {
                accept: 'application/json',
                'x-ibm-client-secret': metSecret,
                'x-ibm-client-id': metID,
            },
        },
    }).then((response) => {
        const { modelRunDate } = response.features[0].properties
        const delayTime = 1000 * 60 * 10
        const difference = differenceInMinutes(
            new Date(),
            new Date(modelRunDate)
        )
        if (difference > 30) {
            console.log(
                `Model run at ${modelRunDate} which is ${difference} minutes ago; delaying for ${
                    delayTime / 1000
                } seconds`
            )
            setTimeout(() => fetchWeather(resolve), delayTime)
        } else {
            resolve(response)
        }
    })
}

module.exports = function getWeather() {
    let resolve
    const weatherPromise = new Promise((res) => (resolve = res))
    fetchWeather(resolve)
    return weatherPromise
}
