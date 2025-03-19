require('dotenv').config();
const twilio = require("twilio");
const fs = require('fs');
const schedule = require('node-schedule');

// Add temporary check in your code

// Initialize Twilio client
if (!process.env.TWILIO_ACCOUNT_SID?.startsWith('AC')) {
  throw new Error('Invalid Twilio Account SID');
}
if (!process.env.TWILIO_PHONE_NUMBER?.startsWith('+')) {
  throw new Error('Invalid Twilio Phone Number');
}
const client = require('twilio')(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);
// Load users from JSON file
const users = JSON.parse(fs.readFileSync('users.json', 'utf-8'));

async function makeScheduledCall(user) {
  try {
    const twiml = `
      <Response>
        <Say voice="woman" language="en-IN">
          Hello ${user.name}, ${user.message} Thank you for using Care Connect.
        </Say>
      </Response>
    `;

    const call = await client.calls.create({
      twiml: twiml,
      to: user.phone,
      from: process.env.TWILIO_PHONE_NUMBER
    });

    console.log(`Call scheduled for ${user.name} at ${user.schedule}. SID: ${call.sid}`);
  } catch (error) {
    console.error(`Failed to schedule call for ${user.name}:`, error.message);
  }
}

// Schedule calls for all users
function scheduleCalls() {
  users.forEach(user => {
    // Parse schedule time (format: HH:mm)
    const [hour, minute] = user.schedule.split(':');
    
    // Create schedule rule (UTC time - adjust timezone if needed)
    const rule = new schedule.RecurrenceRule();
    rule.tz = 'Asia/Kolkata'; // Set to Indian time zone
    rule.hour = parseInt(hour);
    rule.minute = parseInt(minute);

    // Schedule the call
    schedule.scheduleJob(rule, () => {
      console.log(`Triggering call to ${user.name} at ${user.schedule}`);
      makeScheduledCall(user);
    });

    console.log(`Scheduled call for ${user.name} at ${user.schedule} daily`);
  });
}

// Start the scheduler
scheduleCalls();

// Keep the script running
console.log('Scheduler is running. Press Ctrl+C to exit.');
process.on('SIGINT', () => {
  console.log('Cancelling all scheduled jobs...');
  Object.keys(schedule.scheduledJobs).forEach(id => schedule.cancelJob(id));
  process.exit();
});


// Schedule existing reminders on startup


// Initialize scheduler
