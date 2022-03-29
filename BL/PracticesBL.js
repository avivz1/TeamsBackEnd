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
    practice.Students.forEach(st=>{
        if(stuId==st.Student_ID){
            st.Name=stu_name
        }
    })
    return updatePracticeStudents(practice._id,practice.Students)

}

const deleteStudentFromPractice = async function (stu_practices, stu_name, stuId) {
    let practices = []
    stu_practices.forEach(pra => {
        practices.push(getPracticeAndDeleteStudent(pra._id, stuId, stu_name))
    })

    const allPromises = Promise.all(practices);
    const list = await allPromises;

    if (list.includes(undefined || false)) {
        return false;
    } else {
        return true;
    }

    // let practice = await getPractice(p_id);
    // let practiceStudent = practice.Students.filter(st=>st._id==stu_id);
    // practiceStudent.Name

    //     studentsArr = []
    //     students.forEach(stu_id => {
    //         studentsArr.push(addPracticeToSingleStudent(stu_id, pra_id))
    //     })
    //     const allPromises = Promise.all(studentsArr);
    //     const list = await allPromises;

    //     if (list.includes(undefined || false)) {
    //         return false;
    //     } else {
    //         return true;
    //     }
    // }
}




module.exports = {updatePracticeStudents, deleteStudentFromPractice, updatePractice, deletePractice, getPractice, getAllPractice, addPractice }