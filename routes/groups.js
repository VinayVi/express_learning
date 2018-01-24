var express = require('express');
var router = express.Router();

var Group = require('../models/group');
var Transaction = require('../models/transaction');

//validate that one of the members of the group is the current owner of the group
router.post('/create', function(req, res, next) {
    var group = new Group({
        Members: req.body.members
    });

    group.save(function(err, newRef) {
        if(err) {
            next(err);
        } else {
            res.json(newRef);
        }
    })
})

//Creating a new way to make groups
//One user makes the group
//Other users can then join the group
router.post('/createnew', function(req, res, next) {
    var group = new Group({
        Members: [req.body.member]
    });

    group.save(function(err, newRef) {
        if(err) {
            next(err);
        } else {
            res.json(newRef);
        }
    });
})

router.post('/:id/join', function(req, res, next) {
    Group.findById(req.params.id, function(err, group) {
        if(err) {
            next(err);
        } else {
            group.Members.push(req.body._id);
            group.save(function(err) {
                if(err) {
                    next(err);
                } else {
                    res.json(group);
                }
            });
        }
    });
})

router.get('/:id/balances', function(req, res, next) {
    Group.findById(req.params.id, function(err, group) {
        if(err) {
            next(err);
        } else {
            group.calculateBalances();
            group.save(function(err) {
                if(err) {
                    next(err);
                } else {
                    res.json({_id: group._id, balances: group.Balances});
                }
            });
        }
    });
});

router.get('/:id/transactions', function(req, res, next) {
    Group.findById(req.params.id, function(err, group) {
        if(err) {
            next(err);
        } else {
            res.json({_id: group._id, transactions: group.Transactions});
        }
    });
});

router.get('/:id/members', function(req, res, next) {
    Group.findById(req.params.id, function(err, group) {
        if(err) {
            next(err);
        } else {
            res.json({_id: group._id, members: group.Members});
        }
    });
});

module.exports = router;