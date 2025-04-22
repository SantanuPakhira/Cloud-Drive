const express = require('express');
const dotenv = require('dotenv');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const path = require('path');
const connectToDB = require('./config/db')
const userRouter = require('./routes/user.routes')
const indexRouter = require('./routes/index.routes')

dotenv.config();
connectToDB();

const app = express();

// Set EJS as view engine
app.set('view engine', 'ejs');

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Middlewares

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

app.use(session({
  secret: 'yourSecretKey',  // use a long, random secret in production || Change this to something long & random in production
  resave: false,
  saveUninitialized: false
}));

// Routers

app.use('/', indexRouter)
app.use('/user', userRouter)

// Route Protection Middleware

function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
      return next(); // user is authenticated, continue
    }
    res.redirect('/user/login'); // else, redirect to login
  }

  // Add this route to serve the homepage
app.get('/', (req, res) => {
    res.render('index'); // Render the 'index.ejs' view
  });

  
  // Protected Route
 /*
   app.get('/', isAuthenticated, (req, res) => {
    res.render('index', { user: req.session.user });
  });


*/
app.get('/home', isAuthenticated, (req, res) => {
  res.render('home', { user: req.session.user });
});


app.use('/', indexRouter);


// Start server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
})