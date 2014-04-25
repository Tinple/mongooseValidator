var mongoose = require('mongoose');
var v = require('../lib/validator')
var Schema = mongoose.Schema;

new Schema({ email: {type: String, validate: v.v('email|trim')} })