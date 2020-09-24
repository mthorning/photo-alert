const { getHours, getDate } = require('date-fns')

function getIntervals(timeSeries, sunriseHour, tomorrow) {
  const index = timeSeries.findIndex((data) => {
    const date = new Date(data.time)
    return getHours(date) === sunriseHour && getDate(date) === getDate(tomorrow)
  })
  return timeSeries.slice(index - 1, index + 2)
}

module.exports = function collate({ tides, geoData, weather, tomorrow }) {
  const intervals = getIntervals(
    weather.features[0].properties.timeSeries,
    Number(geoData.sunrise.slice(0, 2)),
    tomorrow
  )

  const descriptions = Object.entries(weather.parameters[0]).reduce(
    (descs, [key, data]) => ({ ...descs, [key]: data.description }),
    {}
  )

  const forecastData = Object.entries(intervals[0]).reduce(
    (parameters, [key, data]) => ({
      ...parameters,
      [key]: {
        values: intervals.map((interval) => interval[key]),
        ...(descriptions[key] ? { description: descriptions[key] } : {}),
      },
    }),
    {}
  )

  return ({ weather: forecastData, geoData, tides: tides.extremes })
}

