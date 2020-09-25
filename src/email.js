const nodemailer = require('nodemailer')

// create transporter object with smtp server details
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
    },
})

module.exports = function email(html) {
    transporter.sendMail(
        {
            to: process.env.EMAIL_ADDRESS,
            from: process.env.EMAIL_USERNAME,
            subject: 'Weather Report',
            html,
        },
        (err, info) => {
            if (err) console.error('error sending email: ', err)
        }
    )
}
