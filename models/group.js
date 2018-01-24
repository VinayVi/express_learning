//group.js

var mongoose = require('mongoose');
var async = require('async');
var Schema = mongoose.Schema;
var Transaction = require('./transaction');

var GroupSchema = new Schema({
    Members: [Schema.Types.ObjectId],       //Members of the group
    Transactions: [Schema.Types.ObjectId],  //Transactions in the group
    Balances: [{                            //Who owes who and how much
        A: Schema.Types.ObjectId,           //A owes B the amount specified
        B: Schema.Types.ObjectId,
        Amount: Number
    }],
    Name: String
}, { timestamps: true });

GroupSchema.methods.calculateBalances = function() {
    var group = this;
    var balances = new Array(group.Members.length);
    for(let i = 0; i < balances.length; i++) {
        balances[i] = {Member: group.Members[i], Amount: 0};
    }

    async.each(group.Transactions, function(transactionId, callback) {
        Transaction.findById(transactionId, function(err, transaction) {
            if(err) {
                console.log(err);
            } else {
                var owedAmount = transaction.Amount / transaction.Members.length;
                balances[group.Members.indexOf(transaction.Owner)].Amount += transaction.Amount;
                transaction.Members.forEach(function(memberId) {
                    balances[group.Members.indexOf(memberId)].Amount -= owedAmount;
                })
            }
            callback();
        })
    }, function(err) {
        if(err) {
            console.log(err);
        } else {
            group.Balances = [];
            balances = sort(balances);

            while(!allZero(balances)) {
                balances = sort(balances);
                var index = indexOfPos(balances);
                var amount = 0;
                if(balances[0].Amount * -1 > balances[index].Amount) {
                    amount = balances[index].Amount;
                    balances[0].Amount += balances[index].Amount;
                    balances[index].Amount = 0;
                } else {
                    amount = balances[0].Amount * -1;
                    balances[index].Amount += balances[0].Amount;
                    balances[0].Amount = 0;
                }
                group.Balances.push({
                    A: balances[0].Member,
                    B: balances[index].Member,
                    Amount: amount
                });
                balances = sort(balances);
            }
        }
    });
}

function allZero(arr) {
    for(let i = 0; i < arr.length; i++) {
        if(arr[i].Amount != 0) {
            return false;
        }
    }
    return true;
}

function compareAsc(a, b) {
    return a.Amount - b.Amount;
}

function compareDsc(a, b) {
    return b.Amount - a.Amount;
}

function indexOfPos(arr) {
    for(let i = 0; i < arr.length; i++) {
        if(arr[i].Amount > 0) {
            return i;
        }
    }
    return 0;
}

function sort(arr) {
    arr.sort(compareAsc);
    var index = indexOfPos(arr);
    return arr.slice(0, index).concat(arr.slice(index).sort(compareDsc));
}

GroupSchema.methods.addTransaction = function(transactionId) {
    this.Transactions.push(transactionId);
}

module.exports = mongoose.model('Group', GroupSchema);