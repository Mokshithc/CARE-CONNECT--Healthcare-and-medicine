require('dotenv').config(); // Add this at the top of makecall.js

// Download the helper library from https://www.twilio.com/docs/node/install
const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";

// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure
const accountSid = process.env.ACb2c7495a6406d014aac91cc70a15ed84;
//const authToken = process.env['0273b4e22ae12515054340048a1be71b'];
//const authToken = process.env.TWILIO_AUTH_TOKEN;
//const client = twilio(accountSid, authToken);

/*async function createCall() {
  const call = await client.calls.create({
    from: "+123456789",
    to: "+919535234689",
    url: "http://demo.twilio.com/docs/voice.xml",
  });

  console.log(call.sid);
}

createCall();

// makecall.js
const hi='morning';
client.calls.create({
    twiml: `<Response><Say> please take ur medication${hi} zintac 350 </Say></Response>`,
    to: '+919535234689',     // Verified Indian number (e.g., +91XXXXXXXXXX)
    from: '+12316255785'     // Your Twilio number
  }).then(call => console.log('Call SID:', call.sid));
*/

  require('dotenv').config();
const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Function to initiate a call with a dynamic message
async function makeCall(to, message) {
  try {
    const twiml = `
      <Response>
        <Say voice="woman">Hello, this is a reminder from Care Connect. ${message}</Say>
      </Response>
    `;

    await client.calls.create({
      twiml: twiml,
      to: to,
      from: process.env.TWILIO_PHONE_NUMBER // Your Twilio number
    });
    console.log(`Call initiated to ${to}`);
  } catch (error) {
    console.error(`Failed to call ${to}:`, error.message);
  }
}

module.exports = { makeCall };