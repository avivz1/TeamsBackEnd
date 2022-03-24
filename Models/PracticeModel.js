const mongoose = require('mongoose');

let PracticesSchema = new mongoose.Schema({

    User_ID: mongoose.ObjectId,
    Name: String,
    Date:Date,
    Students: [{Id: mongoose.ObjectId,Name:String}],
    Team : {Id: mongoose.ObjectId, Name: String},
    PracticeHour: String,
    
});

module.exports = mongoose.model('practices', PracticesSchema);

