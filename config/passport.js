var passport = require('passport');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var User = require('../models/user');
var config = require('../config/database');

passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
    secretOrKey: config.secret
}, function(jwt_payload, done) {
    User.findById(jwt_payload._doc._id, function(err, user) {
        if(err) {
            return done(err);
        } else if(!user) {
            return done(null, false);
        } else {
            return done(null, user);
        }
    })
}))

module.exports = passport;