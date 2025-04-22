const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('index', { user: req.session.user });
});

router.get('/about', (req, res) => {
  res.render('about', { user: req.session.user });
});

router.get('/contact', (req, res) => {
  res.render('contact', { user: req.session.user });
});

module.exports = router;