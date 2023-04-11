require('dotenv').config();

const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const verifyJWT = require('./middleware/verifyJWT');
const cookieParser = require('cookie-parser');
const corsOption = require('./config/corsOption');
const { logger } = require('./middleware/logEvents');
const credentials = require('./middleware/credentials');
const errorHandler = require('./middleware/errorHandler');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');
const PORT = process.env.PORT || 3500;

//connect to mongodb
connectDB();

app.use(logger);

//handle options credentials check - before CORS
// and fetch cookies credentials requirement
app.use(credentials);

//cross site auth
app.use(cors(corsOption));

//built-in middleware to handle urlencoded data
//in other words, form data
//'content-type:application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));

//built-in middleware for json
app.use(express.json());

// middleware for cookies
app.use(cookieParser());

//built-in middleware for static files
// app.use(express.static(path.join(__dirname, '/public')));
app.use('/', express.static(path.join(__dirname, '/public')));

//home page
app.use('/', require('./routes/root'));
//register
app.use('/register', require('./routes/register'));
//login
app.use('/auth', require('./routes/auth'));
//refreshToken
app.use('/refresh', require('./routes/refresh'));
//logout
app.use('/logout', require('./routes/logout'));

//after login,server needs to check JWT every time
app.use(verifyJWT);
app.use('/employees', require('./routes/api/employees'));

app.all('*', (req, res) => {
  res.status(404);
  //if the header accepts html, the response returns a html file
  if (req.accepts('html')) {
    console.log(req);
    //if the header accepts json, the response returns a json file
    res.sendFile(path.join(__dirname, 'views', '404.html'));
  } else if (req.accepts('json')) {
    res.json({ error: '404 Not Found' });
  } else {
    //if not accepting above two type, then return content as a txt type
    res.type('txt').send('404 Not Found');
  }
  // res.status(404).sendFile(path.join(__dirname, views, '404.html'));
});

app.use(errorHandler);

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
