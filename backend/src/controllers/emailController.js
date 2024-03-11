/*
const formData = require('form-data');
const Mailgun = require('mailgun.js');
const mailgun = new Mailgun(formData);
const mg = mailgun.client({ username: "api", key: process.env.MAILGUN_API_KEY });

const emailTest = (req, res) => {
    try {
        mg.messages.create('sandbox89bb0b3d834f40b4acfe1588bd5066eb.mailgun.org', {
            from: "Excited User <mailgun@sandbox89bb0b3d834f40b4acfe1588bd5066eb.mailgun.org>",
            to: ["juho.lipponen@edu.savonia.fi"],
            subject: "Hello",
            text: "Testing some Mailgun awesomeness!",
            html: "<h1>Testing some Mailgun awesomeness!</h1>"
        })
        .then(msg => console.log(msg))
        .catch(err => console.log(err));
    
        res.status(200).send();
    } catch (error) {
        res.status(500).send();
    }
}

module.exports = { emailTest };
*/