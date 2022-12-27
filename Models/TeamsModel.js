const mongoose = require('mongoose');


let TeamsSchema = new mongoose.Schema({

    User_ID:mongoose.ObjectId,
    Name : String,
    CreatedDate:Date,
    Type:String,
    City:String,
    Image : String

});

module.exports  = mongoose.model('teams',TeamsSchema);

