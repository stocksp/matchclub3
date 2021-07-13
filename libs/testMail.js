import { withMongo } from "./mongo";
const AbortController = require('node-abort-controller');
global.AbortController = AbortController;
const nodemailer = require("nodemailer");
const mg = require("nodemailer-mailgun-transport");


const handler = async (req, res) => {
  try {
    console.log("starting testMail");
    const api_key = process.env.EMAIL_API_KEY;
    //Your domain, from the Mailgun Control Panel
    const domain = process.env.EMAIL_DOMAIN;
    const auth = {
      auth: {
        api_key: api_key,
        domain: domain
      }
    };
    const nodemailerMailgun = nodemailer.createTransport(mg(auth));
    const resp = await nodemailerMailgun.sendMail({
      from: "admin@cornerpins.com",
      to: [process.env.EMAIL_ME, process.env.EMAIL_CAP], // An array if you have multiple recipients.
      subject: "Testing email in new App",
      "h:Reply-To": process.env.EMAIL_ME,
      //You can use "html:" to send HTML email content. It's magic!
      html:
        "<html><p>Greetings from the Continental MatchClub Website</p><p> Info here!! </p></html>",
      //You can use "text:" to send plain-text content. It's oldschool!
      text: "League update ... should not see this!!"
    });
    return {message: "ok", resp};
  } catch (error) {
    console.log('testMail exception', error);
    return error;
    
  }
};

export default withMongo(handler);
