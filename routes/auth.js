// routes/auth.js
const express = require('express');
const router = express.Router();
const { User } = require('../models');
const bcrypt = require('bcrypt');

// GET registration form
router.get('/register', (req, res) => {
  res.render('register', { error: null });
});


// POST registration
router.post('/register', async (req, res) => {
  const { name, email, phone, password, confirmPassword } = req.body;
  if (password !== confirmPassword) {
    return res.render('register', { error: 'Passwords do not match.' });
  }
  try {
    const user = await User.create({ name, email, phone, password });
    req.session.userId = user.id;
    res.redirect('/reminders');
  } catch (error) {
    console.error(error);
    res.render('register', { error: 'Registration failed. Please try again.' });
  }
});

// GET login form
router.get('/login', (req, res) => {
  res.render('login', { error: null });
});

// POST login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.render('login', { error: 'Invalid email or password.' });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.render('login', { error: 'Invalid email or password.' });
    }
    req.session.userId = user.id;
    res.redirect('/reminders');
  } catch (error) {
    console.error(error);
    res.render('login', { error: 'Login failed. Please try again.' });
  }
});

// GET logout
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

module.exports = router;
