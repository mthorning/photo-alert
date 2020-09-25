const path = require('path')
const fs = require('fs')

module.exports = function capture(fileName) {
    return function (data) {
        return new Promise((resolve) => {
            fs.writeFile(
                path.resolve(process.cwd(), `${fileName}.json`),
                JSON.stringify(data, null, 4),
                (err) => {
                    if (err) console.error(err)
                    resolve(data)
                }
            )
        })
    }
}
