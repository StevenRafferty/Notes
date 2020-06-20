const express = require('express');
const passport = require('passport');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const uuid = require('uuid');

const router = express.Router();

const lib = require('../../lib');

const User = require('../../Models/User');

router.get(
  '/login',
  (req, res) => {
    res.status(200).render('login');
  }
);

router.post(
  '/login',
  passport.authenticate('local'),
  lib.ensureAuthenticated,
  (req, res) => {
    res.status(200).json({ msg: 'Logged in' });
  }
);

router.post(
  '/register',
  [
    check('username').exists({ checkFalsy: true, checkNull: true }),
    check('email').isEmail().withMessage('Invalid email address'),
    check('password').isLength({ min: 8, max: 255 }).withMessage('Password must be between 8 - 255 in length'),
    check('confirmPassword').isLength({ min: 8, max: 255 }).withMessage('Password must be between 8 - 255 in length')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    const { username, email, password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
      return res.status(422).json({ errors: [ { msg: 'Passwords must match', param: 'confirmPassword', location: 'body' } ] });
    }
    // Check if user already exists
    const currentUser = await User.findOne({ where: { username } });
    if (currentUser) {
      return res.status(422).json({ errors: [ { msg: 'User already exists' } ] });
    }
    // Create the user
    bcrypt.genSalt(10, (error, salt) => {
      bcrypt.hash(password, salt, (error, hash) => {
        if (error) throw error;
        const newUser = User.create({ id: uuid.v4(), username, email, password: hash });
        console.log(newUser);
        res.status(200).json({ msg: 'Account has been created' });
      });
    });

  }
)

module.exports = router;
