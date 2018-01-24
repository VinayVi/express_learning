//user.js

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

var UserSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    }
    //Adds Groups Array later
}, { timestamps: true });

UserSchema.pre('save', function(next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    bcrypt.hash(user.password, 10, function(err, hash) {
        if(err) {
            return next(err);
        }
        user.password = hash;
        next();
    })
});

UserSchema.set('toJSON', {
    getters: true,
    transform: function(doc, ret, options) {
        delete ret.password;
        return ret;
    }
});

UserSchema.methods.validPassword = function(password, callback) {
    bcrypt.compare(password, this.password, callback);
}

module.exports = mongoose.model('User', UserSchema);
