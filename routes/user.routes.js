/*
const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator'); */
/*const userModel = require('../models/user.model') */
/* const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.get('/register', (req, res) => {
    res.render ('register');
});

router.post('/register',
    body('email').trim().isEmail().isLength({ min: 5}),
    body('password').trim().isLength({ min: 5}),
    body('username').trim().isLength({ min: 3}),
    async (req, res) => {

        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            return res.status(400).json({
                error: errors.array(),
                message: 'Invalid data'
            })
        }

        const { email, username, password } = req.body;
        const hashPassword = await bcrypt.hash(password, 10)

        const newUser = await userModel.create({
            email,
            username,
            password: hashPassword
        })

        res.json(newUser)
    });

    router.get('/login', (req, res) => {
        res.render('login')
    })

    router.post('/login',
        body('username').trim().isLength({ min: 3 }),
        body('password').trim().isLength({ min: 5 }),
        async(req, res) => {

            const errors = vaildationResult(req);

            if(!errors.isEmpty()){
                return res.status(400).json({
                    error: errors.array(),
                    message: 'Invalid data'
                })
            }

            const { username, password } = req.body;

            const user = await userModel.findOne({
                username: username
            })

            if(!user){
                return res.status(400).json({
                    message: 'username or password is incorrect'
                })
            }

            const isMatch = await bcrypt.compare(password,user.password)

            if(!ismatch){
                return res.status(400).json({
                    message: 'username or password is incorrect'
                })
            }


            const token = jwt.sign({
                userId: user._id,
                email: user.email,
                username: user.username
            },
            process.env.JWT_SECRET,
        )

        res.cookie('token', token)

        res.send('Logged in')
        }
    )


module.exports = router;
*/

const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require('../models/user.model'); // Correct model reference
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.get('/register', (req, res) => {
    res.render('register');
});

// Register Route
router.post('/register', [
    body('email').trim().isEmail().isLength({ min: 5 }),
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

router.get('/login', (req, res) => {
    res.render('login');
});

// Login Route
router.post('/login', [
    body('username').trim().isLength({ min: 3 }),
    body('password').trim().isLength({ min: 5 })
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
            return res.status(400).json({ message: 'Username or password is incorrect' });
        }

        const token = jwt.sign({
            userId: user._id,
            email: user.email,
            username: user.username
        }, process.env.JWT_SECRET);

        res.cookie('token', token);
        res.send('Logged in');
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
