const path = require('path')
const fetch = require('node-fetch')
const capture = require('./capture.js')

function onError(name, details) {
    console.error(`${name} tide network error: `, details)
    process.exit(1)
}

function makeCall({ name, url, options }) {
    console.log(`fetching ${name} data`)
    return fetch(url, options)
        .then((response) => {
            if (!response.ok) throw new Error(response)
            return response.json()
        })
        .then(capture(name))
        .catch((error) => onError(error))
}

module.exports = function request({ name, ...rest }) {
    const call = () => makeCall({ name, ...rest })
    try {
        const data = require(path.resolve(process.cwd(), `${name}.json`))
        if (data && (data.length || Object.keys(data).length)) return data
        return call()
    } catch (e) {
        return call()
    }
}
