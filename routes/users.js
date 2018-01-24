var express = require('express');
var router = express.Router();
var passport = require('../config/passport');
var jwt = require('jsonwebtoken');
var config = require('../config/database');

var User = require('../models/user');

//validate that the email and the password actually exist
//do something to prevent spam, idk?
router.post('/register', function(req, res) {
    var user = new User({
        email: req.body.email,
        password: req.body.password
    });

    user.save(function(err) {
        if(err) {
            next(err);
        } else {
            res.json({ message: 'User saved successfully'});
        }
    })
    
});

//This seems done, need to add a log off route??
router.post('/login', function(req, res, next) {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({email:email}, function (err, user) {
        if(err) {
            next(err);
        } else if(!user) {
            res.json({ message: 'Incorrect Email'});
        } else (user.validPassword(password, function(err, isMatch) {
            if(err) {
                next(err);
            } else if(!isMatch) {
                res.json({ success: false, message: 'Incorrect Password'});
            } else {
                const token = jwt.sign(user, config.secret, {
                    expiresIn: 604800 //1 week in seconds
                });
                res.json({
                    success: true,
                    token: 'JWT ' + token,
                    user: {
                        _id: user._id,
                        email: user.email,
                    }
                })
            }
        }))
    })
})

router.get('/profile', passport.authenticate('jwt', {session:false}), function(req, res) {
    res.json({user: req.user});
})
 
module.exports = router;