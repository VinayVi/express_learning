//transaction.js

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TransactionSchema = new Schema({
    Owner: Schema.Types.ObjectId,           //The ID of the owner of the transaction
    Group: Schema.Types.ObjectId,         //The group this belongs to
    Members: [Schema.Types.ObjectId],       //The ID's of the other members of the transaction
    Amount: Number,                         //The TOTAL amount of money owed to the Owner. Eg, Owner is owed X, but members owe X/(members.length) each
    TransactionDate: Date,                  //Date of the transaction
}, { timestamps: true })

module.exports = mongoose.model('Transaction', TransactionSchema);