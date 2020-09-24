const { format, addDays } = require('date-fns')
const sigWeatherCodes = require('./significantWeatherCodes.js')
const fs = require('fs')

function transform(key, value) {
  if (key === 'significantWeatherCode') return sigWeatherCodes(value)
  return value.toFixed(1)
}

function makeWeatherTable(times, weatherData) {
  const style = 'style="border: 1px solid black; padding: 2px;"'
  return `
<table style="border-collapse: collapse">
    <thead>
        <th ${style}>Parameter</th>
            ${times
              .map(
                (time) =>
                  `<th ${style}>${format(new Date(time), 'dd/MM HH:mm')}</th>`
              )
              .join('')} 
    <thead>
    <tbody>
        ${Object.entries(weatherData)
          .map(
            ([key, { values, description }]) =>
              `<tr>
                <td ${style}>${description}</td>
                ${values
                  .map((value) => `<td ${style}>${transform(key, value)}</td>`)
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
              `<li>${format(new Date(datetime), 'dd/MM HH:mm')} - ${state}</li>`
          )
          .join('')}
    </ul>
    `
}

module.exports = function makeHTML({ tides, weather, geoData }) {
  const {
    time: { values: times },
    ...weatherData
  } = weather

  const weatherTable = makeWeatherTable(times, weatherData)
  const tidesList = makeTidesList(tides)
  const report = `
    <h3>Sun</h3>
    <div>Sunrise: ${geoData.sunrise}</div>
    <div>Sunset: ${geoData.sunset}</div>
    <hr />
    <h3>Tides</h3>
    ${tidesList}
    <hr />
    <h3>Weather</h3>
    ${weatherTable}
    `

  fs.writeFile('index.html', report, () => {})
}
