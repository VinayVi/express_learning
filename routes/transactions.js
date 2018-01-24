var express = require('express');
var router = express.Router();
var passport = require('../config/passport')

var Transaction = require('../models/transaction');
var Group = require('../models/group');

router.post('/create', function (req, res) {
    //use passport authentication
    //Change owner to be the req.user._id
    //Validate that the owner belongs to the group
    //Validate that the members belong to the group
    var transaction = new Transaction({
        Owner: req.body.owner,
        Group: req.body.group,
        Members: req.body.members,
        Amount: req.body.amount,
        TransactionDate: req.body.transactionDate
    });

    transaction.save(function (err, tran) {
        if (err) {
            next(err);
        } else {
            Group.findById(req.body.group, function(err, group) {
                if(err) {
                    next(err);
                } else {
                    group.Transactions.push(tran._id);
                    group.save(function(err) {
                        if(err) {
                            next(err);
                        } else {
                            res.json({group: group, transaction: tran})
                        }
                    })
                }
            })
        }
    })



});

router.get('/:id', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    //validate that the user making the request belongs to the same group as this transaction
    var id = req.params.id;
    Transaction.findById(id, function (err, transaction) {
        if(err) {
            next(err);
        } else {
            res.json(transaction);
        }
    })
})

module.exports = router;