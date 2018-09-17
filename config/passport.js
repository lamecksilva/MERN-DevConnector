const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
const User = mongoose.model('users');
const keys = require('../config/keys');

const opts = {};      // Object containing the options to control how the token is extracted from request
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();     // Create a new extractor with the header bearer
opts.secretOrKey = keys.secretOrKey;                        // Pass a public key for verifying token's signature

module.exports = (passport) => {
  passport.use(new JwtStrategy(opts, (jwt_payload, done)=> {
    User.findById(jwt_payload.id)   // Search for the user with the id in the payload
      .then(user => {
        if(user){
          return done(null,user);     // passport error callback accepting arguments done(error,user,info)
        }
        return done(null, false);
      })
      .catch(err => console.log(err));    // catch err
  }));
};