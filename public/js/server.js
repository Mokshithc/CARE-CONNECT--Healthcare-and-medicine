const express = require('express');
const app = express();
const path = require('path');

// Configure view engine and static files
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
    res.render('welcome'); // Your animated splash screen
});

app.get('/career', (req, res) => {
    res.render('career'); // Your career goal page
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});