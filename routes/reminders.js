// routes/reminders.js
const express = require('express');
const router = express.Router();
const { Reminder } = require('../models');
const scheduleJobManager = require('../scheduler');

// Middleware to check if user is logged in
function isAuthenticated(req, res, next) {
  if (req.session.userId) {
    return next();
  }
  res.redirect('/login');
}

// List reminders for the logged-in user
router.get('/', isAuthenticated, async (req, res) => {
  try {
    const reminders = await Reminder.findAll({ where: { UserId: req.session.userId } });
    res.render('reminders', { reminders });
  } catch (error) {
    console.error(error);
    res.send('Error fetching reminders.');
  }
});

// Show form to create a new reminder
router.get('/new', isAuthenticated, (req, res) => {
  res.render('newReminder');
});

// Create a new reminder
router.post('/new', isAuthenticated, async (req, res) => {
  const { medication, schedule, message } = req.body;
  try {
    const reminder = await Reminder.create({
      medication,
      schedule,
      message,
      UserId: req.session.userId
    });
    // Schedule the new reminder
    scheduleJobManager.scheduleReminder(reminder);
    res.redirect('/reminders');
  } catch (error) {
    console.error(error);
    res.send('Error creating reminder.');
  }
});

// Show form to edit an existing reminder
router.get('/edit/:id', isAuthenticated, async (req, res) => {
  try {
    const reminder = await Reminder.findOne({ where: { id: req.params.id, UserId: req.session.userId } });
    if (!reminder) {
      return res.send('Reminder not found.');
    }
    res.render('editReminder', { reminder });
  } catch (error) {
    console.error(error);
    res.send('Error fetching reminder.');
  }
});

// Update a reminder
router.post('/edit/:id', isAuthenticated, async (req, res) => {
  const { medication, schedule, message } = req.body;
  try {
    const reminder = await Reminder.findOne({ where: { id: req.params.id, UserId: req.session.userId } });
    if (!reminder) {
      return res.send('Reminder not found.');
    }
    await reminder.update({ medication, schedule, message });
    // Cancel the previous job and reschedule with updated info
    scheduleJobManager.cancelReminder(reminder.id);
    scheduleJobManager.scheduleReminder(reminder);
    res.redirect('/reminders');
  } catch (error) {
    console.error(error);
    res.send('Error updating reminder.');
  }
});

// Delete a reminder
router.post('/delete/:id', isAuthenticated, async (req, res) => {
  try {
    const reminder = await Reminder.findOne({ where: { id: req.params.id, UserId: req.session.userId } });
    if (!reminder) {
      return res.send('Reminder not found.');
    }
    await reminder.destroy();
    scheduleJobManager.cancelReminder(reminder.id);
    res.redirect('/reminders');
  } catch (error) {
    console.error(error);
    res.send('Error deleting reminder.');
  }
});

module.exports = router;
