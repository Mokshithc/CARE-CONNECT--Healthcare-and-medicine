# Care Connect - Healthcare and medicine 💊

A voice-based medication reminder system that automatically calls users at scheduled times to remind them to take their medication. Built with Twilio, Node.js, and Node-Schedule.



## Features ✨
- Automated voice calls for medication reminders.
- Customizable schedules and messages per user.
- Support for multiple users with JSON-based storage.
- Integration with Twilio for reliable voice calls.
- Fallback to SMS (optional) for users without smartphone access.

## Prerequisites 📋
- A [Twilio Account](https://www.twilio.com/) (Free Trial Available).
- Node.js v16+ installed.
- A Twilio phone number ([Buy Here](https://console.twilio.com/us1/develop/phone-numbers/manage/numbers)).

## Installation 🛠️

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Mokshithc/care-connect.git
   cd care-connect
How to run

add ur twilio auth token ,number , sid  and ur local mysql db details  in .env file


 Twilio 
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=
PORT=3000
SESSION_SECRET=


 MySQL 
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=
MYSQL_DATABASE=medication_reminder_db
