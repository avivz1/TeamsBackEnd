const mongoose = require('mongoose');

let PracticesSchema = new mongoose.Schema({

    User_ID: mongoose.ObjectId,
    Name: String,
    Date:Date,
    Students: [{Student_ID: mongoose.ObjectId,Name:String}],
    Team : {Team_ID: mongoose.ObjectId, Name: String},
    PracticeHour: String,
    
});

module.exports = mongoose.model('practices', PracticesSchema);

