const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
    role : {type : String},
	sequenceValue : {Type : Number, default : 0}
});

module.exports = mongoose.model('RoleCounter', counterSchema);