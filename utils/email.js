const nodemailer = require('nodemailer');
const htmlToText = require('html-to-text');
const pug = require('pug');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.emailAddress;
    this.username = user.username;
    this.otp = user.otp;
    this.url = url;
    this.from =
      process.env.NODE_ENV === 'production'
        ? `admin <${process.env.EMAIL_FROM_PROD}>`
        : `admin <${process.env.EMAIL_FROM_DEV}>`;
  }

  newTransport() {
    // production (NANTI)
    if (process.env.NODE_ENV === 'production') {
      return nodemailer.createTransport({
        // sendinblue
        service: 'SendinBlue',
        auth: {
          user: process.env.SENDINBLUE_USERNAME,
          pass: process.env.SENDINBLUE_PASSWORD,
        },
      });
    }

    // dev (using mailtrap)
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST_DEV,
      port: process.env.EMAIL_PORT_DEV,
      secure: false,
      logger: true,
      auth: {
        user: process.env.EMAIL_USERNAME_DEV,
        pass: process.env.EMAIL_PASSWORD_DEV,
      },
    });
  }

  async send(template, subject) {
    // send the actual email
    // render HTML based on a .. template (NANTI)
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      username: this.username,
      url: this.url,
      otp: this.otp,
      subject,
    });

    // mendefinisi opsi email
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.fromString(html),
    };

    // membuat transport dan mengirim email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendOTP() {
    await this.send(
      'sendOTP',
      'Verifikasi OTP Anda (Hanya berlaku selama 5 menit)'
    );
  }
};
