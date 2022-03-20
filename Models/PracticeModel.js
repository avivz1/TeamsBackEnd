const mongoose = require('mongoose');

let PracticesSchema = new mongoose.Schema({

    User_ID: mongoose.ObjectId,
    Team_ID: mongoose.ObjectId,
    Name: String,
    CreatedDate: Date,
    PreviousTeam: String,
    PracticeDate: String,
});

module.exports = mongoose.model('practices', PracticesSchema);

