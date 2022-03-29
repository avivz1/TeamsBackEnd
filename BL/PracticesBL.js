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

const getAllPractices = function (userid) {
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
        let stus = students.map(id => {
            let obj = {
                Name: null,
                Student_ID: id
            }
            return obj;
        })

        const p = new PRACTICES_MODEL({
            User_ID: practice.userid,
            Date: practice._date,
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

const updatePracticeStudents = function (p_id, students) {
    return new Promise((resolve, reject) => {
        PRACTICES_MODEL.findByIdAndUpdate(p_id,
            {
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

const getPracticeAndDeleteStudent = async function (praid, stuId, stu_name) {
    let practice = await getPractice(praid);
    practice.Students.forEach(st => {
        if (stuId == st.Student_ID) {
            st.Name = stu_name
        }
    })
    return updatePracticeStudents(practice._id, practice.Students)

}

const updatePracticeTeam = function (p_id, team) {
    return new Promise((resolve, reject) => {
        console.log(team.Name)
        PRACTICES_MODEL.findByIdAndUpdate(p_id,
            {
                Team: team,
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

const deleteTeamFromPractice = async function (team,userid) {
    console.log(team)
    let practicesPromises = [];
    let obj = {
        Team_ID: team._id,
        Name: team.Name
    }
    let allPractices = await getAllPractices(userid);
    console.log('allpractices |||| '+JSON.stringify(allPractices))
    let matchingPractices = allPractices.filter(p => p.Team.Team_ID.toString() == team._id);
    console.log(matchingPractices.length)

    matchingPractices.forEach(p => {
        practicesPromises.push(updatePracticeTeam(p._id, obj))
    })

    const allPromises = Promise.all(practicesPromises);
    const list = await allPromises;

    if (list.includes(undefined || false)) {
        return false;
    } else {
        return true;
    }



}

const deleteStudentFromPractice = async function (stu_name, stuId,userid) {
    console.log(stu_name)
    console.log(stuId)
    let practices = []
    let practicesFromDB = await getAllPractices(userid);
    console.log(practicesFromDB)
    practicesFromDB.forEach(pra => {
        practices.push(getPracticeAndDeleteStudent(pra._id, stuId, stu_name))
    })

    const allPromises = Promise.all(practices);
    const list = await allPromises;

    if (list.includes(undefined || false)) {
        return false;
    } else {
        return true;
    }

}




module.exports = { updatePracticeTeam, deleteTeamFromPractice, updatePracticeStudents, deleteStudentFromPractice, updatePractice, deletePractice, getPractice, getAllPractices, addPractice }