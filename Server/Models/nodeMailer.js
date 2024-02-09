const nodemailer = require('nodemailer');
const {email,passwordForEmail} = require('../../client/src/config');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: email,
    pass: passwordForEmail
  },
});

module.exports = transporter;
