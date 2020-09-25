const { format, addDays } = require('date-fns')
const sigWeatherCodes = require('./significantWeatherCodes.js')
const fs = require('fs')

function transform(value) {
    return /\./.test(value) ? value.toFixed(2) : value
}

function makeWeatherTable(times, weatherData) {
    const style = (nowrap) =>
        `style="border: 1px solid black;padding: 2px;${
            nowrap ? 'white-space:nowrap;text-align:center;' : ''
        }"`

    return `
<table style="border-collapse: collapse">
    <thead>
        <th ${style(0)}>Parameter</th>
            ${times
                .map(
                    (time) =>
                        `<th ${style(0)}>${format(new Date(time), 'HH')}</th>`
                )
                .join('')} 
    <thead>
    <tbody>
        ${Object.entries(weatherData)
            .map(
                ([key, { values, description }]) =>
                    `<tr>
                <td ${style(0)}>${description}${
                        key === 'significantWeatherCode' ? ' *' : ''
                    }</td>
                ${values
                    .map((value) => `<td ${style(1)}>${transform(value)}</td>`)
                    .join('')}
            </tr>`
            )
            .join('')}
    </tbody>
</table>
    `
}

function makeTidesList(tides) {
    return `
    <ul style="padding: 0; list-style-type: none;">
        ${Object.values(tides)
            .map(
                ({ datetime, state }) =>
                    `<li>${state.replace('TIDE', '')} - ${format(
                        new Date(datetime),
                        'dd/MM HH:mm'
                    )}</li>`
            )
            .join('')}
    </ul>
    `
}

module.exports = function makeHTML({ modelRunDate, tides, weather, geoData }) {
    const {
        time: { values: times },
        ...weatherData
    } = weather

    const weatherTable = makeWeatherTable(times, weatherData)
    const tidesList = makeTidesList(tides)
    const report = `
    <h1>Weather Report</h1>
    <h2>${format(new Date(geoData.date), 'yyyy-MM-dd')}</h2>
    <h6>Report generated: ${format(new Date(modelRunDate), 'HH:mm:ss')}</h6>
    <h3>Sun</h3>
    <div>Sunrise: ${geoData.sunrise}</div>
    <div>Sunset: ${geoData.sunset}</div>
    <hr />
    <h3>Tides</h3>
    ${tidesList}
    <hr />
    <h3>Weather</h3>
    ${weatherTable}
    <div>*weather codes:</div>
    <ul style="padding: 0; list-style-type: none;">
        ${Array.from(new Set(weatherData.significantWeatherCode.values))
            .map((code) => `<li>${code}: ${sigWeatherCodes(code)}</li>`)
            .join('')}
    </ul>
    `

    return report
}
