const sendGrid = require('@sendgrid/mail');
require('dotenv').config();
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const SENDGRID_FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL;
const SENDGRID_FROM_NAME = process.env.SENDGRID_FROM_NAME;
sendGrid.setApiKey(SENDGRID_API_KEY);

const createEmail = (fromName, fromEmail, to, subject, message) => {
    const emailBody = {
        to: to,
        from: {
            name: fromName,
            email: fromEmail
        },
        subject: subject,
        text: message,
        html: `<h3>${message}</h3>`
    }
    return emailBody;
}

exports.sendEmail = async (to, subject, message)=> {
    const emailBody = createEmail(SENDGRID_FROM_NAME, SENDGRID_FROM_EMAIL, to, subject, message);
    await sendGrid.send(emailBody)
    .then(res => console.log(`Email for ${subject} sent successfully....`))
    .catch(err => console.log(err.message))
}