

const schedule = require('node-schedule');
const users = require('./users.json');
const { makeCall } = require('./makecall');

users.forEach(user => {
  // Split time into hours and minutes (e.g., "08:00" → 8, 0)
  const [hour, minute] = user.schedule.split(':').map(Number);
  
  // Schedule job daily at the specified time
  const job = schedule.scheduleJob({ hour, minute }, () => {
    console.log(`Calling ${user.name} at ${user.phone}...`);
    makeCall(user.phone, user.message);
  });
});