const nodemailer = require('nodemailer');
const { google } = require('googleapis');

/**
 *
 * @param {String} to String of students emails separated by comma
 * @param {String} subject The subject of the email
 * @param {String} text The content to be send on email
 * @returns Object success, accepted and rejected mails
 */
const sendNewMail = async (to, subject, html) => {
  let accessToken;

  // OAuth client configuration
  try {
    const oAuth2Client = new google.auth.OAuth2(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      process.env.REDIRECT_URI
    );

    // Setting auth credentials
    oAuth2Client.setCredentials({
      refresh_token: process.env.REFRESH_TOKEN,
    });

    // Generating access token
    accessToken = await oAuth2Client.getAccessToken();
  } catch (error) {
    return { success: false, errorMsg: 'error generating access token' };
  }

  try {
    // nodemailer configuration
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'oAuth2',
        user: 'smartplacement73@gmail.com',
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken,
      },
    });

    // Mail options
    const mailOptions = {
      from: 'smartplacement73@gmail.com',
      to,
      subject,
      html,
    };

    // Sending mail
    const { accepted, rejected } = await transporter.sendMail(mailOptions);
    return {
      success: true,
      accepted,
      rejected,
    };
  } catch (error) {
    return { success: false, errorMsg: 'Error sending email' };
  }
};

module.exports = sendNewMail;
