const PRACTICES_MODEL = require('../Models/PracticeModel')
const date = new Date()
var StudentsBL = require('../BL/StudentsBL');
var UserBL = require('../BL/UsersBL');

const getStudentAttendants = async function (userId, stuId) {
    // let promises = []
    let arr = [];
    let stu = await StudentsBL.getStudent(stuId)
    //full object
    let allPractices = await getAllPractices(userId)
    //id array
    let stuPractices = stu.Practices;

    let was = []
    let wasnt = []
    allPractices.filter(p => {
        p.Students.forEach(stu => {
            if (stu.Student_ID == stuId) {
                if (stuPractices.includes(p._id)) {
                    was.push(p)
                } else {
                    wasnt.push(p)
                }
            }
        })
    })

    let json = {
        presentPractices: was,
        notPresentPractices: wasnt
    }
    return json;

}

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
            , function (err, id) {
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

const getPracticeAttendancePrecent = async function (practice, userId) {
    let arr = await StudentsBL.getAllStudentsByUserID(userId);
    let promises = []
    practice.Students.forEach(practiceStu => {
        promises.push(isStudentWasInPractice(arr, practiceStu.Student_ID, practice._id))
    });

    const allPromises = Promise.all(promises);
    const list = await allPromises;


    if (list.includes(undefined)) {
        return false;
    } else {
        let allTrue = list.filter(element => element == true)
        let max = practice.Students.length
        let obj = {
            result : Math.abs(allTrue.length / max) * 100,
            date : practice.Date
        }
        return obj; 
        // return (Math.abs(allTrue.length / max) * 100);
    }

}

const isStudentWasInPractice = (arr, stuId, practiceId) => {

    let student = arr.filter(stu => stu._id == stuId.toString() && stu.Practices.includes(practiceId.toString()))
    if (typeof student[0] == 'object') {
        return true;
    } else {
        return false;
    }


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

const addOrRemovePracticeFromStudent = async function (chosenStudents, allStudents, practice) {
    let promises = []
    allStudents.forEach(stu => {
        if (stu.isDeleted == false) {
            if (stu.isChecked == false && chosenStudents.includes(stu._id)) {
                promises.push(StudentsBL.addPracticeToSingleStudent(stu._id, practice._id))
            } else if (stu.isChecked == true && !chosenStudents.includes(stu._id)) {
                promises.push(StudentsBL.deletePracticeId(stu._id, practice._id))
            }
        }
    });

    const allPromises = Promise.all(promises);
    const list = await allPromises;

    if (list.includes(undefined || false)) {
        return false;
    } else {
        return true;
    }

}

const getTotalDivision = async function (userId) {
    let _present = 0;
    let _notPresent = 0;
    let allStudents = await StudentsBL.getAllStudentsByUserID(userId);
    let allPractices = await getAllPractices(userId);
    let studentObject = '';

    allPractices.forEach(p => {
        p.Students.forEach(s => {
            allStudents.forEach(studen => {
                if (studen._id == s.Student_ID.toString()) {
                    studentObject = studen;
                }
            })
            if (studentObject) {
                if (studentObject.Practices.includes(p._id)) {
                    _present = _present + 1;
                } else {
                    _notPresent = _notPresent + 1;
                }
            }
        })
    })
    let obj = {
        present: _present,
        notPresent: _notPresent,
        total: _present + _notPresent
    }
    return obj;

}

const getTotalDivisionByMonth = async function (userId) {
    // let userDay = userObj[0].CreatedDate.split('/')[0]
    // let userMonth = userObj[0].CreatedDate.split('/')[1]
    // let allStudents = await StudentsBL.getAllStudentsByUserID(userId);
    // let userObj = await UserBL.getUserById(userId);
    // let userYear = userObj[0].CreatedDate.split('/')[2]
    
    let arr=[0,0,0,0,0,0,0,0,0,0,0,0]
    let thisYear = new Date().getFullYear();
    let allPractices = await getAllPractices(userId);
    let promises = []

    allPractices.forEach(p => {
        promises.push(getPracticeAttendancePrecent(p, userId))
    });

    const allPromises = Promise.all(promises);
    const list = await allPromises;

    if (list.includes(undefined || false)) {
        return false;
    } else {
        let newList = list.map(x=>{
            let obj = {
                result: x.result,
                month:x.date.getMonth()+1,
                year : x.date.getFullYear()
            }
            return obj
        })

        newList.forEach(obj => {
            if(obj.year==thisYear){
                arr[obj.month-1] = (arr[obj.month-1]+obj.result)/2
            }
        });

        return arr;
    }


}


module.exports = { getTotalDivisionByMonth, getTotalDivision, getStudentAttendants, getPracticeAttendancePrecent, addOrRemovePracticeFromStudent, isStudentWasInPractice, getStudentsList, deleteFewStudentsFromPractices, updatePracticeTeam, deleteTeamFromPractice, updatePracticeStudents, deleteStudentFromPractice, updatePractice, deletePractice, getPractice, getAllPractices, addPractice }