const mongoose = require('mongoose');

let PracticesSchema = new mongoose.Schema({

    User_ID: mongoose.ObjectId,
    Team_ID: mongoose.ObjectId,
    Name: String,
    PreviousTeam: String,
    PracticeHour: Date,
    PracticeDate: Date,
});

module.exports = mongoose.model('practices', PracticesSchema);

