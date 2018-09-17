const express = require("express");
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');

// Load user Model
const User = require('../../models/User');

// @Route   GET api/users/test
// @desc    Tests users route
// @access  Public
router.get("/test", (req, res) => res.json({ msg: "Users Works" }));

// @Route   POST api/users/register
// @desc    Register User
// @access  Public
router.post('/register',(req, res)=>{
  User.findOne({ email: req.body.email })     // Search for a email in the DB
    .then(user => {
      if(user){               // If exists an user with that email return an error
        return res.status(400).json({email: 'Email already exists'});
      } else {                  // Else, create a new user
        const avatar = gravatar.url(req.body.email, {
          s: '200',  // Size
          r: 'pg',   // Rating
          d: 'mm'   // Default
        });

        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          avatar,
          password: req.body.password
        });

        bcrypt.genSalt(10, (err,salt)=>{
          bcrypt.hash(newUser.password, salt, (err, hash)=> {
            if(err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => res.json(user))
              .catch(err => console.log(err));
          });
        });
      }
    })
});

// @Route   POST api/users/login
// @desc    Login User /  Returning JWT Token
// @access  Public
router.post('/login',(req,res)=>{
  const email = req.body.email;
  const password = req.body.password;

  // Find user by email
  User.findOne({email})
    .then(user => {
      // Check for user
      if(!user){
        return res.status(404).json({email: 'User email not found'});
      }

      // Check password
      bcrypt.compare(password, user.password).then(isMatch => {
          if(isMatch){
            // User Matched

            const payload = {
              id: user.id,
              name: user.name,
              avatar: user.avatar
            } // Create JWT payload

            // Sign Token
            jwt.sign(        // When user log in, the backend creates a signed token and returns it in response
              payload,
              keys.secretOrKey,
              { expiresIn: 3600 },
              (err, token)=> {
                res.json({
                  success: true,
                  token: 'Bearer ' + token
                });
            });
          } else {
            return res.status(400).json({password: 'Password Incorrect'})
          }
        })
    })
});



// @Route   GET api/users/current
// @desc    Return current user
// @access  Private
router.get('/current',passport.authenticate('jwt',{session: false}), 
(req,res)=>{
  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email
  });
});
// Passport allows an option to store the user object in the request instead of the session

module.exports = router;
