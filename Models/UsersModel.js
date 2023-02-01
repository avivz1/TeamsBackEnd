const mongoose = require('mongoose');

let UsersSchema = new mongoose.Schema({
   Email:String,
   Password:String,
   CreatedDate:String,
   SecurityQestion:String,
   SecurityAnswer:String,
});

module.exports  = mongoose.model('users',UsersSchema);

