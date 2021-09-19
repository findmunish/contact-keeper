const express = require('express');
const path = require('path');
const connectDB = require('./config/db');

const app = express();

// Connect Database
connectDB();

// Init middleware
app.use( express.json({ extended: false }) );

app.get('/', (req, res) => res.json({ msg: 'Welcome to the Contact-Keeper API....' }) );

// Define routes
app.use ('/api/users', require('./routes/users'));
app.use ('/api/auth', require('./routes/auth'));
app.use ('/api/contacts', require('./routes/contacts'));

const PORT = process.env.PORT || 5000

// Server static assets in production
if (process.env.NODE_ENV === 'production') {
    // Set static folder
    app.use( express.static('./client/buid') );

    app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, 'client', 'index.html')));
}

app.listen(PORT, () => console.log(`Server started on port ${PORT}`) );
