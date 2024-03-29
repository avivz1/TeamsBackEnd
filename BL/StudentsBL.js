const STUDENTS_MODEL = require('../Models/StudentModel');


const addNewStudent = function (student) {
    return new Promise((resolve, reject) => {
        const stu = new STUDENTS_MODEL({
            User_ID: student.userid,
            Team_ID: student.teamID,
            Name: student.name,
            CreatedDate: new Date().getDate() + '/' + (new Date().getMonth() + 1 + '/' + new Date().getFullYear()),
            Belt: student.belt,
            City: student.city,
            Age: student.age,
            Image: '',
            EmergencyContact: student.emergencyContact,
            Phone: student.phoneNum,
            Activities: []
        });
        stu.save(function (err, newStudent) {
            if (err) {
                reject(false);
            } else {
                resolve(newStudent._id);
            }
        })
    })
}

const deleteStudentById = function (id) {
    return new Promise((resolve, reject) => {
        STUDENTS_MODEL.findByIdAndDelete(id, function (err) {
            if (err) {
                reject(false);
            } else {
                resolve(true);
            }
        })
    });
}

const getAllStudentsByUserID = function (userid) {
    return new Promise((resolve, reject) => {
        STUDENTS_MODEL.find({ User_ID: userid }, function (err, students) {
            if (err) {
                reject(false);
            } else {
                resolve(students);
            }
        })
    })
}

const updateStudentSoftDetails = function (student) {
    return new Promise((resolve, reject) => {
        STUDENTS_MODEL.findByIdAndUpdate(student.studentId,
            {
                Name: student.name,
                Belt: student.belt,
                Age: student.age,
                City: student.city,
                Team_ID: student.Team_ID,
                EmergencyContact: student.emergencyContact,
                Phone: student.phoneNum
            }
            , function (err) {
                if (err) {
                    reject(false);
                } else {
                    resolve(true);
                }
            })
    })
}

const updateStudentTeamID = function (teamId, stuID) {
    return new Promise((resolve, reject) => {
        STUDENTS_MODEL.findByIdAndUpdate(stuID,
            {
                Team_ID: teamId,
            }
            , function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(true);
                }
            })
    })
}

const updateStudentPractice = function (practices, stu_id) {
    return new Promise((resolve, reject) => {
        STUDENTS_MODEL.findByIdAndUpdate(stu_id,
            {
                Practices: practices,
            }
            , function (err) {
                if (err) {
                    reject(false);
                } else {
                    resolve(true);
                }
            })
    })
}

const getStudentByUserAndStudentId = function (userId, stuId) {
    return new Promise((resolve, reject) => {
        STUDENTS_MODEL.find({ User_ID: userId, _id: stuId }, function (err, stu) {
            if (err) {
                reject(err);
            } else {
                resolve(stu);
            }
        })
    })
}

const getStudent = function (id) {
    return new Promise((resolve, reject) => {
        STUDENTS_MODEL.findById(id, function (err, stu) {
            if (err) {
                reject(false);
            } else {
                resolve(stu);
            }
        })
    })
}

const getFewStudentsByPractice = async function (arr) {
    let promises = [];

    arr.forEach(stu => {
        promises.push(getStudent(stu.Student_ID))
    });

    const allPromises = Promise.all(promises);
    const list = await allPromises;

    if (list.includes(undefined || false)) {
        return false;
    } else {
        return list;
    }
}

const getStudentsByTeamId = async function (teamId, userId) {
    let students = await getAllStudentsByUserID(userId);
    let studentsByTeamArr = students.filter(stu => stu.Team_ID == teamId)
    return studentsByTeamArr;
}

const deleteFewStudents = async function (studArr) {
    return new Promise((resolve, reject) => {
        let arr = studArr.filter(s => { return s._id })
        STUDENTS_MODEL.deleteMany({ _id: { $in: arr } }, function (err) {
            if (err) {
                reject(false);
            } else {
                resolve(true)
            }
        })
    })


}

const changeStudentsTeam = async function (teamId, stuArr) {
    students = []
    stuArr.forEach(stu => {
        students.push(updateStudentTeamID(teamId, stu._id))
    })

    const allPromises = Promise.all(students);
    const list = await allPromises;

    if (list.includes(undefined || false)) {
        return false;
    } else {
        return true;
    }
}

const addPracticeToSingleStudent = async function (stu_id, practice_id) {
    return new Promise((resolve, reject) => {
        STUDENTS_MODEL.findByIdAndUpdate(stu_id, {
            "$push": { "Practices": practice_id }
        }, function (err) {
            if (err) {
                reject(false)
            } else {
                resolve(true)
            }
        })
    })
}

const addPracticeToStudents = async function (pra_id, students) {
    let studentsArr = []
    if (students.length > 0) {
        students.forEach(stu_id => {
            studentsArr.push(addPracticeToSingleStudent(stu_id, pra_id))
        })
        const allPromises = Promise.all(studentsArr);
        const list = await allPromises;

        if (list.includes(undefined || false)) {
            return false;
        } else {
            return true;
        }
    }
}

const deletePracticeFromStudents = async function (p_id, p_students) {
    studentArr = []
    p_students.forEach(stu => {
        studentArr.push(deletePracticeId(stu.Student_ID, p_id))
    })

    const allPromises = Promise.all(studentArr);
    const list = await allPromises;

    if (list.includes(undefined || false)) {
        return false;
    } else {
        return true;
    }

}

const deletePracticeId = async function (stu_id, p_id) {
    let stu = await getStudent(stu_id);
    if (stu) {
        let studentsPractices = stu.Practices.filter(s => s != p_id)
        let res = updateStudentPractice(studentsPractices, stu_id)
        if (res != false) {
            return true;
        } else {
            return false;
        }
    }
}

const addOrUpdateStudentPhoto = async function (photo, stuId) {
    return new Promise((resolve, reject) => {
        STUDENTS_MODEL.findByIdAndUpdate(stuId, {
            Image: photo
        }, function (err) {
            if (err) {
                reject(false);
            } else {
                resolve(true)
            }
        })
    })

}

const deleteFewStudentsByTeam = async function (teams, userId) {
    let students = await getAllStudentsByUserID(userId)
    if (students.length > 0) {
        let stude = students.filter(s => {
            if (teams.includes(s.Team_ID.toString())) {
                return s._id;
            }
        })
        return deleteFewStudents(stude);
    }

}

const getFewStudents = async function (studentsArr) {
    return new Promise((resolve, reject) => {
        STUDENTS_MODEL.find({ _id: { $in: studentsArr } }, function (err, stus) {
            if (err) {
                reject(false)
            } else {
                resolve(stus)
            }
        })
    })
}

const getBeltsAverage = async function (userId) {
    let map = new Map();
    map.set('white', 0)
    map.set('yellow', 0)
    map.set('orange', 0)
    map.set('green', 0)
    map.set('blue', 0)
    map.set('brown', 0)
    map.set('black', 0)
    let students;
    try {
        students = await getAllStudentsByUserID(userId);
    } catch (e) {
        return false;
    }
    if (students.length > 0) {
        const totalStus = students.length
        students.forEach(stu => {
            map.set(stu.Belt, map.get(stu.Belt) + 1)
        });
        for (const [key, value] of map) {
            map.set(key, ((value / totalStus) * 100).toFixed(2))
        }
    }
    return map;
}

const resetDb = async function (userId) {
    return new Promise((resolve, reject) => {
        STUDENTS_MODEL.deleteMany({ User_ID: userId }, function (err) {
            if (err) {
                reject(err)
            } else {
                resolve(true)
            }
        })

    })
}

const addNewActivity = async function (data) {
    return new Promise((resolve, reject) => {
        STUDENTS_MODEL.findByIdAndUpdate(data.stuId, { "$push": { "Activities": data.activity } }, function (err, obj) {
            if (err) {
                reject(false)
            } else {
                resolve(obj)
            }
        })
    })
}

const deleteActivity = async function (data) {
    return new Promise((resolve, reject) => {
        STUDENTS_MODEL.updateOne({ _id: data.stuId }, { "$pull": { "Activities": { _id: data.activity._id } } }, function (err, data) {
            if (err) {
                reject(false)
            } else {
                resolve(true)
            }
        })
    })
}

const getStudentActivities = async function (data) {
    let student = await getStudentByUserAndStudentId(data.userId, data.stuId);
    if (student.length > 0) {
        return student[0].Activities;
    } else {
        return [];
    }
}

module.exports = { getStudentByUserAndStudentId, getStudentActivities, deleteActivity, addNewActivity, resetDb, getBeltsAverage, getFewStudents, deleteFewStudentsByTeam, addOrUpdateStudentPhoto, getFewStudentsByPractice, updateStudentPractice, deletePracticeId, deletePracticeFromStudents, addPracticeToSingleStudent, addPracticeToStudents, changeStudentsTeam, deleteFewStudents, getStudentsByTeamId, addNewStudent, deleteStudentById, getAllStudentsByUserID, updateStudentTeamID, updateStudentSoftDetails, getStudent }