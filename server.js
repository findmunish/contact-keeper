const express = require('express');
const path = require('path');
// const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// Connect Database
connectDB();

// app.options('*', cors()) // include before other routes

// // use cors as middleware
// app.use(cors());

// Init middleware
app.use( express.json({ extended: false }) );

if (process.env.NODE_ENV !== 'production') {
    app.get('/', (req, res) => res.json({ msg: 'Welcome to the Contact-Keeper API....' }) );
}

// Define routes
app.use ('/api/users', require('./routes/users'));
app.use ('/api/auth', require('./routes/auth'));
app.use ('/api/contacts', require('./routes/contacts'));

const PORT = process.env.PORT || 5000

// Server static assets in production
if (process.env.NODE_ENV === 'production') {
    // Set static folder
    app.use(express.static('client/build'));

    app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html')) );
}

app.listen(PORT, () => console.log(`Server started on port ${PORT}`) );