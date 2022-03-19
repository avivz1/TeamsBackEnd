const mongoose = require('mongoose');
let StudentSchema = new mongoose.Schema({
    
    User_ID:mongoose.ObjectId,
    Team_ID:mongoose.ObjectId,
    Name : String,
    CreatedDate:Date,
    Belt:String,
    Age:Number,
    City:String,
    Dates:[String]
});

module.exports  = mongoose.model('students',StudentSchema);

