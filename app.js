// app.js
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const { sequelize, Reminder } = require('./models');
const scheduleJobManager = require('./scheduler');

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.static('public'));
// Middleware to parse request bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

// Set EJS as view engine
app.set('view engine', 'ejs');

// Make session accessible in views
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

// Import routes
const authRoutes = require('./routes/auth');
const reminderRoutes = require('./routes/reminders');

// Define routes
app.use('/', authRoutes);
app.use('/reminders', reminderRoutes);

// Sync database then schedule existing reminders and start the server
sequelize.sync().then(async () => {
  console.log('Database synced');

  // Load and schedule all existing reminders from the database
  const reminders = await Reminder.findAll();
  reminders.forEach(reminder => {
    scheduleJobManager.scheduleReminder(reminder);
  });

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
app.get('',function(req,res){
  
          res.redirect('/login');
          
      });


