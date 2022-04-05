const PRACTICES_MODEL = require('../Models/PracticeModel')
const date = new Date()
var StudentsBL = require('../BL/StudentsBL');

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

const updatePractice = function (practice) {
    return new Promise((resolve, reject) => {
        PRACTICES_MODEL.findByIdAndUpdate(practice._id,
            {
                Name: practice.name,
                Date: practice.date,
            }
            , function (err,id) {
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

const getPracticeAndDeleteStudent = async function (practice, stuId, stu_name) {
    practice.Students.forEach(st => {
        if (stuId == st.Student_ID) {
            st.Name = stu_name
        }
    })
    return updatePracticeStudents(practice._id, practice.Students)

}

const updatePracticeTeam = function (p_id, team) {
    return new Promise((resolve, reject) => {
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

const deleteTeamFromPractice = async function (team, userid) {
    let practicesPromises = [];
    let obj = {
        Team_ID: team._id,
        Name: team.Name
    }
    let allPractices = await getAllPractices(userid);
    let matchingPractices = allPractices.filter(p => p.Team.Team_ID.toString() == team._id);

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

const deleteStudentFromPractice = async function (stu_name, stuId, userid) {
    let practices = []
    let practicesFromDB = await getAllPractices(userid);
    practicesFromDB.forEach(pra => {
        practices.push(getPracticeAndDeleteStudent(pra, stuId, stu_name))
    })

    const allPromises = Promise.all(practices);
    const list = await allPromises;

    if (list.includes(undefined || false)) {
        return false;
    } else {
        return true;
    }

}

const deleteFewStudentsFromPractices = async function (students, userId) {
    let deletePractices = []
    students.forEach(stu => {
        deletePractices.push(deleteStudentFromPractice(stu.Name, stu._id, userId))
    })
    const allPromises = Promise.all(deletePractices);
    const list = await allPromises;

    if (list.includes(undefined || false)) {
        return false;
    } else {
        return true;
    }

}
const isStudentWasInPractice = (arr, stuId, practiceId) => {
    let student = arr.filter(stu=>stu._id==stuId && stu.Practices.includes(practiceId))
    if(typeof student[0]=='object'){
        return true;
    }else{
        return false;
    }

    // arr.forEach(stud => {
    //     if (stud._id == stuId && stud.Practices.includes(practiceId)) {
    //         return true;
    //     } else {
    //         return false;
    //     }
    // })
}

const getStudentsList = async function (practiceId, students, userId) {
    let arr = await StudentsBL.getAllStudentsByUserID(userId);

    if (students.length <= 0) {
        return false;
    }

    let list = students.map((s) => {

        let obj = { isChecked: false, isDeleted: false, Name: '', _id: '' }

        if (s.Name == null) {
            let stud = arr.filter(st => st._id == s.Student_ID);
            obj.isChecked = isStudentWasInPractice(arr, s.Student_ID, practiceId)
            obj.isDeleted = false;
            obj.Name = stud[0].Name;
            obj._id = s.Student_ID;
            return obj;
        } else {
            obj.isChecked = isStudentWasInPractice(arr, s.Student_ID, practiceId)
            obj.isDeleted = true
            obj.Name = s.Name
            obj._id = s._id
            return obj
        }

    });

    if (list.length <= 0) {
        return false;
    }
    return list;
}

const addOrRemovePracticeFromStudent = async function (chosenStudents,allStudents,practiceId){
    //Resume from here - need to understand how to remove or add the student by the update process
    console.log('chosenStudents || ' +JSON.stringify(chosenStudents))
    console.log('allStudents || ' +JSON.stringify(allStudents))
    console.log('practiceId || ' +JSON.stringify(practiceId))
    return true;
}



module.exports = {addOrRemovePracticeFromStudent, isStudentWasInPractice, getStudentsList, deleteFewStudentsFromPractices, updatePracticeTeam, deleteTeamFromPractice, updatePracticeStudents, deleteStudentFromPractice, updatePractice, deletePractice, getPractice, getAllPractices, addPractice }