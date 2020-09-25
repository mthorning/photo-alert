const request = require('./utils/request.js')

const {
    config: { latitude, longitude },
} = require('../package.json')

module.exports = function getTides() {
    return request({
        name: 'tide',
        url: `https://tides.p.rapidapi.com/tides?latitude=${latitude}&longitude=${longitude}`,
        options: {
            headers: {
                'x-rapidapi-host': 'tides.p.rapidapi.com',
                'x-rapidapi-key': process.env.TIDE_KEY,
                useQueryString: true,
                accept: 'application/json',
            },
        },
    })
}
