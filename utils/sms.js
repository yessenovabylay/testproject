require("dotenv").config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const send = async (body, to) => {
  const client = require('twilio')(accountSid,authToken);

  try {
    console.log({body,to})
    const message = await client.messages
    .create({
      body,
      from: '+12183163388',
      to
    })
    console.log(message.sid);
  } catch(e) {
    console.error(e);
  }

}

module.exports = send;

