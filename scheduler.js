// scheduler.js
require('dotenv').config();
const schedule = require('node-schedule');
const twilio = require('twilio');

if (!process.env.TWILIO_ACCOUNT_SID?.startsWith('AC')) {
  throw new Error('Invalid Twilio Account SID');
}
if (!process.env.TWILIO_PHONE_NUMBER?.startsWith('+')) {
  throw new Error('Invalid Twilio Phone Number');
}

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// In-memory object to track scheduled jobs (keyed by reminder ID)
const scheduledJobs = {};

function scheduleReminder(reminder) {
  // Parse schedule (expected format "HH:mm")
  const [hour, minute] = reminder.schedule.split(':');
  const rule = new schedule.RecurrenceRule();
  rule.hour = parseInt(hour, 10);
  rule.minute = parseInt(minute, 10);

  // Schedule a daily job
  const job = schedule.scheduleJob(rule, () => {
    console.log(`Triggering reminder ID ${reminder.id} for medication ${reminder.medication}`);
    makeCall(reminder);
  });

  scheduledJobs[reminder.id] = job;
  console.log(`Scheduled reminder (ID: ${reminder.id}) at ${reminder.schedule} daily`);
}

function cancelReminder(reminderId) {
  if (scheduledJobs[reminderId]) {
    scheduledJobs[reminderId].cancel();
    delete scheduledJobs[reminderId];
    console.log(`Cancelled reminder (ID: ${reminderId})`);
  }
}

async function makeCall(reminder) {
  try {
    // Get associated user (this method is added by Sequelize due to our association)
    const user = await reminder.getUser();
    const twiml = `
      <Response>
        <Say voice="woman" language="en-US">
          Reminder: this is care connect ${reminder.medication}. ${reminder.message}
        </Say>
      </Response>
    `;

    const call = await client.calls.create({
      twiml: twiml,
      to: user.phone,
      from: process.env.TWILIO_PHONE_NUMBER
    });

    console.log(`Call initiated for reminder ID ${reminder.id}. SID: ${call.sid}`);
  } catch (error) {
    console.error(`Error making call for reminder ID ${reminder.id}:`, error.message);
  }
}

module.exports = {
  scheduleReminder,
  cancelReminder,
  scheduledJobs
};
