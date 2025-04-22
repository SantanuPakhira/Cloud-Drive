const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require('../models/user.model'); // Correct model reference
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Show register page
router.get('/register', (req, res) => {
    res.render('register');
});

// Handle register form
router.post('/register', [
    body('email').trim().isEmail().isLength({ min: 5 }).withMessage('Invalid email'),
    body('password').trim().isLength({ min: 5 }),
    body('username').trim().isLength({ min: 3 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: errors.array(),
            message: 'Invalid data'
        });
    }

    try {
        const { email, username, password } = req.body;
        const hashPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({  // ✅ Corrected model reference
            email,
            username,
            password: hashPassword
        });

        res.json(newUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Show login page

router.get('/login', (req, res) => {
    res.render('login');
});

// Handle login form

router.post('/login', [
    body('username').trim().isLength({ min: 3 }).notEmpty().withMessage('Username is required'),
    body('password').trim().isLength({ min: 5 }).notEmpty().withMessage('Password is required')
], async (req, res) => {
    const errors = validationResult(req); // ✅ Fixed spelling error

    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: errors.array(),
            message: 'Invalid data'
        });
    }

    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username: username }); // ✅ Correct model reference

        if (!user) {
            return res.status(400).json({ message: 'Username or password is incorrect' });
        }

        const isMatch = await bcrypt.compare(password, user.password); // ✅ Fixed `isMatch` variable

        if (!isMatch) {
            return res.status(400).send('Username or password is incorrect');
            //return res.status(400).json({ message: 'Username or password is incorrect' });
        }
// Optional: Generate JWT (not required if using session)

        const token = jwt.sign({
            userId: user._id,
            email: user.email,
            username: user.username
        }, process.env.JWT_SECRET);

        res.cookie('token', token); // optional for session-only apps
        
            // Store user in session
        req.session.user = {
            _id: user._id,
            username: user.username,
            email: user.email
      };

        res.redirect('/home');
        //res.send('Logged in');
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

  // Logout route
  /*
router.get('/logout', (req, res) => {
    req.session.destroy(() => {
      res.redirect('/user/login');
    });
  });
  */
  router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to log out' });
      }
      res.redirect('/'); // Redirect to homepage after logout
    });
  });

module.exports = router;