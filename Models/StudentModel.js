const mongoose = require('mongoose');
let StudentSchema = new mongoose.Schema({

    User_ID: mongoose.ObjectId,
    Team_ID: mongoose.ObjectId,
    Name: String,
    CreatedDate: String,
    Belt: String,
    Age: Number,
    City: String,
    Practices: [mongoose.ObjectId],
    Image: String,
    Phone: Number,
    EmergencyContact: { Name: String, Phone: Number },
    Activities: [{ Event: String, Note: String }]


});

module.exports = mongoose.model('students', StudentSchema);

