
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes')
const cookieParser = require('cookie-parser')
const app = express();

// middleware
app.use(express.static('public'));
app.use(express.json()); // it parses the data ..into json format and attaches to handler inside the route
app.use(cookieParser());
// view engine
app.set('view engine', 'ejs');

// database connection
const dbURI = 'mongodb+srv://Rahul:Fooper-1234@first.6gslv.mongodb.net/Auth?retryWrites=true&w=majority';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
  .then((result) => app.listen(5000))
  .catch((err) => console.log(err));

// routes
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies', (req, res) => res.render('smoothies'));
app.use(authRoutes)


