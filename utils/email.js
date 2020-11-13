const nodemailer = require('nodemailer');

const catchAsync = require('./catchAsync');

const createSendMail = async (message, email) => {
  try {
    let transporter = nodemailer.createTransport({
      host: 'smtp.mailtrap.io',
      port: 2525,
      auth: {
        user: process.env.MAILTRAP_USERNAME,
        pass: process.env.MAILTRAP_PASSWORD
      }
    });

    await transporter.sendMail({
      from: process.env.MAIL_SENDER,
      to: email,
      subject: 'Password reset token. Expires in 10 minutes',
      text: message
      //   html:
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports = createSendMail;
