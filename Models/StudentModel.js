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
    Phone: String,
    EmergencyContact: { Name: String, Phone: String },
    Activities: [{ Event: String, Note: String,Date:String }]


});

module.exports = mongoose.model('students', StudentSchema);

