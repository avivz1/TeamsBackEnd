const StudentModel = require('../Models/StudentModel');
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
            Image:''
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
        STUDENTS_MODEL.find({}, function (err, students) {
            if (err) {
                reject(false);
            } else {
                let stuArr = students.filter(s => s.User_ID == userid);
                resolve(stuArr);
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
                Team_ID: student.Team_ID
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

const updateStudentPractice = function (practices ,stu_id) {
    return new Promise((resolve, reject) => {
        STUDENTS_MODEL.findByIdAndUpdate(stu_id,
            {
                Practices: practices,
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

const getStudent = function (id) {
    return new Promise((resolve, reject) => {
        STUDENTS_MODEL.findById(id, function (err, stu) {
            if (err) {
                reject(err);
            } else {
                resolve(stu);
            }
        })
    })
}

const getFewStudentsByPractice = async function (arr){
    let promises =[];

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
    var deleteStu = [];
    studArr.forEach(stu => {
        deleteStu.push(deleteStudentById(stu._id));
    })

    const allPromises = Promise.all(deleteStu);
    const list = await allPromises;

    if (list.includes(undefined || false)) {
        return false;
    } else {
        return true;
    }

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
    studentsArr = []
    if(students.length>0){
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
    p_students.forEach(stu =>{
        studentArr.push(deletePracticeId(stu.Student_ID,p_id))
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
    if(stu){
        let studentsPractices = stu.Practices.filter(s=>s!=p_id)
        let res = updateStudentPractice(studentsPractices,stu_id)
        if(res!=false){
            return true;
        }else{
            return false;
        }
    }
}

const addOrUpdateStudentPhoto = async function (photo,stuId){
    return new Promise ((resolve,reject)=>{
        StudentModel.findByIdAndUpdate(stuId,{
            Image:photo
        },function(err){
            if(err){
                reject(false);
            }else{
                resolve(true)
            }
        })
    })

}


module.exports = {addOrUpdateStudentPhoto,getFewStudentsByPractice,updateStudentPractice, deletePracticeId, deletePracticeFromStudents, addPracticeToSingleStudent, addPracticeToStudents, changeStudentsTeam, deleteFewStudents, getStudentsByTeamId, addNewStudent, deleteStudentById, getAllStudentsByUserID, updateStudentTeamID, updateStudentSoftDetails, getStudent }