const fs = require('fs')
const path = require('path')
const { differenceInMinutes, format } = require('date-fns')
const request = require('./utils/request.js')

const metID = process.env.MET_ID
const metSecret = process.env.MET_SECRET
const {
    config: { latitude, longitude },
} = require('../package.json')

const name = 'data-weather'
function fetchWeather(resolve, count) {
    const dataOrPromise = request({
        name,
        url: `https://api-metoffice.apiconnect.ibmcloud.com/metoffice/production/v0/forecasts/point/hourly?latitude=${latitude}&longitude=${longitude}`,
        options: {
            headers: {
                accept: 'application/json',
                'x-ibm-client-secret': metSecret,
                'x-ibm-client-id': metID,
            },
        },
    })
    if (dataOrPromise.then) {
        dataOrPromise.then((response) => {
            const { modelRunDate } = response.features[0].properties
            const delayTime = 1000 * 60 * 10
            const difference = differenceInMinutes(
                new Date(),
                new Date(modelRunDate)
            )
            if (difference > 30 && count < 3) {
                console.log(
                    `Model run at ${format(
                        new Date(modelRunDate),
                        'yyyy-MM-dd HH:mm:ss'
                    )} which is ${difference} minutes ago; delaying for ${
                        delayTime / 1000
                    } seconds`
                )
                setTimeout(() => fetchWeather(resolve, count + 1), delayTime)
                fs.unlinkSync(path.resolve(process.cwd(), `${name}.json`))
            } else {
                resolve(response)
            }
        })
    } else {
        resolve(dataOrPromise)
    }
}

module.exports = function getWeather() {
    let resolve
    const weatherPromise = new Promise((res) => (resolve = res))
    fetchWeather(resolve, 0)
    return weatherPromise
}
