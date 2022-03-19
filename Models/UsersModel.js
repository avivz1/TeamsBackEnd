const mongoose = require('mongoose');

let UsersSchema = new mongoose.Schema({
   Email:String,
   Password:String,
});

module.exports  = mongoose.model('users',UsersSchema);

