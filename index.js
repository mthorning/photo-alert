// https://app.ipgeolocation.io/
// https://metoffice.apiconnect.ibmcloud.com/metoffice/production/node/173 

const env = require('node-env-file')
const request = require("request");
const { format, addDays, getHours, getDate } = require('date-fns');

env(__dirname + '/.env');


const metID = process.env.MET_ID;
const metSecret = process.env.MET_SECRET;
const geoKey = process.env.GEO_KEY;

const latitude = 49.262951;
const longitude = -5.050700;

function fetch(options, cb) {
 request(options, function (error, response, body) {
      if (error) return console.error('Failed: %s', error.message);

      cb(body);
    });
}

function getGeoTimes(date, cb) {
  const options = { 
    method: 'GET',
    url: `https://api.ipgeolocation.io/astronomy?apiKey=${geoKey}&lat=${latitude.toFixed(4)}&long=${longitude.toFixed(4)}&date=${date}`,
      headers: { 
        accept: 'application/json'
      } 
  };
    
  fetch(options, cb)
}

function getWeather(cb) {
const options = { 
    method: 'GET',
    url: 'https://api-metoffice.apiconnect.ibmcloud.com/metoffice/production/v0/forecasts/point/hourly',
    qs: {
      excludeParameterMetadata: false,
      includeLocationName: true,
      latitude,
      longitude
    },
    headers: { 
      accept: 'application/json',
      'x-ibm-client-secret': metSecret,
      'x-ibm-client-id': metID 
    } 
  };

  fetch(options, cb)
}


function getIntervals(timeSeries, sunriseHour) {
    const index = timeSeries.findIndex(data => {
        const date = new Date(data.time) 
        return getHours(date) === sunriseHour && getDate(date) === getDate(tomorrow)
    })
    return timeSeries.slice(index - 1, index + 2)
}

function createReport(...args) {
    const [geoData, weather] = args.map(arg => JSON.parse(arg))

    const intervals = getIntervals(weather.features[0].properties.timeSeries, Number(geoData.sunrise.slice(0, 2)));

    const descriptions = Object.entries(weather.parameters[0]).reduce((descs, [key, data]) => ({ ...descs, [key]: data.description }), {})

    const forecastData = Object.entries(intervals[0]).reduce((parameters, [key, data]) => ({
        ...parameters,
        [key]: {
            values: intervals.map(interval => interval[key]),
            ...(descriptions[key] ? { description: descriptions[key] } : {})
        }
    }), {});

    console.log({ weather: forecastData, geoData })
}

const tomorrow = addDays(new Date(), 1)
getGeoTimes(format(tomorrow, 'yyyy-MM-dd'), (geoData) => {
    getWeather((weather) => createReport(geoData, weather));
});
