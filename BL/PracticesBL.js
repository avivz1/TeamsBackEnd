const PRACTICES_MODEL = require('../Models/PracticeModel')
const date = new Date()

const getPractice = function (id) {
    return new Promise((resolve, reject) => {
        PRACTICES_MODEL.findById(id, function (err, prac) {
            if (err) {
                reject(false)
            } else {
                resolve(prac)
            }
        })
    })
}

const getAllPractice = function (userid) {
    return new Promise((resolve, reject) => {
        PRACTICES_MODEL.find({}, function (err, practices) {
            if (err) {
                reject(false);
            } else {
                let practicesArr = practices.filter(p => p.User_ID == userid);
                resolve(practicesArr);
            }
        })
    })
}

const addPractice = function (practice, students) {
    return new Promise((resolve, reject) => {
        let stus = students.map(s => {
            let obj = {
                Name: null,
                Id: s._id
            }
            return obj;
        })

        const p = new PRACTICES_MODEL({
            User_ID: practice.userid,
            Date: practice.date,
            Name: practice.name,
            Students: stus,
            Team: { Team_ID: practice.teamID, Name: null },
            PracticeHour: date.getHours() + ':' + date.getMinutes(),

        })

        p.save(function (err, pra) {
            if (err) {
                reject(false)
            } else {
                resolve(pra._id)
            }
        })
    })
}

const deletePractice = function (id) {
    return new Promise((resolve, reject) => {
        PRACTICES_MODEL.findByIdAndDelete(id, function (err) {
            if (err) {
                reject(false)
            } else {
                resolve(true)
            }
        })
    })
}

const updatePractice = function (practice, students) {
    return new Promise((resolve, reject) => {
        PRACTICES_MODEL.findByIdAndUpdate(practice._id,
            {
                Name: practice.name,
                Date: practice.date,
                Students: students,
            }
            , function (err) {
                if (err) {
                    reject(false)
                } else {
                    resolve(true)
                }
            })
    })
}




module.exports = { updatePractice, deletePractice, getPractice, getAllPractice, addPractice }