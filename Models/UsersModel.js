const mongoose = require('mongoose');

let UsersSchema = new mongoose.Schema({
   Email:String,
   Password:String,
   CreatedDate:String,
});

module.exports  = mongoose.model('users',UsersSchema);

