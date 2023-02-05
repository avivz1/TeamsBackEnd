var express = require('express');
var router = express.Router();
var StudentsBL = require('../BL/StudentsBL');
var PracticeBL = require('../BL/PracticesBL');


router.post('/addstudent', async function (req, res, next) {
    let response = await StudentsBL.addNewStudent(req.body);
    if (response) {
        return res.json(response);
    } else {
        return res.json(false);
    }

});

router.post('/addnewstudentactivity', async function (req, res, next) {
    let response = await StudentsBL.addNewActivity(req.body);
    if (response) {
        return res.json(response.Activities);
    } else {
        return res.json(false);
    }

});

router.post('/getFewStudents', async function (req, res, next) {
    let response = await StudentsBL.getFewStudentsByPractice(req.body.students);
    if (response!=false) {
        return res.json(response);
    } else {
        return res.json(false);
    }

});

router.post('/deletestudent', async function (req, res, next) {
    let student = await StudentsBL.getStudent(req.body.stuId);
    let re = await PracticeBL.deleteStudentFromPractice(student.Name, req.body.stuId, req.body.userId);
    let response = await StudentsBL.deleteStudentById(req.body.stuId);
    if (response == true) {
        return res.json(true);
    } else {
        return res.json(false);
    }

});

router.post('/deletefewstudents', async function (req, res, next) {
    let students = await StudentsBL.getFewStudents(req.body.students)
    if(students.length>0){
        let deletePracStatus = await PracticeBL.deleteFewStudentsFromPractices(students, req.body.userId);
        if(deletePracStatus!=false){
            let response = await StudentsBL.deleteFewStudents(students);
            if(response!=false){
                return res.json(true);
            }else{
                return res.json(false);
            }
        }else{
            return res.json(false);
        }
    }else{
        return res.json(false);
    }

});

router.post('/changestudentsteams', async function (req, res, next) {
    let response = await StudentsBL.changeStudentsTeam(req.body.teamId, req.body.students);
    if (response == true) {
        return res.json(true);
    } else {
        return res.json(false);
    }

});

router.post('/editstudent', async function (req, res, next) {
    let response = await StudentsBL.updateStudentSoftDetails(req.body);
    if (response) {
        return res.json(true);
    } else {
        return res.json(false)
    }

});

router.post('/getstudentsbyteamid', async function (req, res, next) {
    let res1 = await StudentsBL.getStudentsByTeamId(req.body.teamId, req.body.userId);
    if (res1) {
        return res.json(res1);
    } else {
        return res.json(false);
    }
});

router.post('/getallstudentsbyuserid', async function (req, res, next) {
    let res1 = await StudentsBL.getAllStudentsByUserID(req.body.userid);
    if (!res1) {
        return res.json(false)
    } else {
        return res.json(res1)
    }
});

router.post('/addorupdatestudentphoto', async function (req, res, next) {
    let res1 = await StudentsBL.addOrUpdateStudentPhoto(req.body.photo,req.body.studentId);
    if (!res1) {
        return res.json(false)
    } else {
        return res.json(res1)
    }
});

router.post('/getBeltsAverage',async function(req,res,next){
    let res1= await StudentsBL.getBeltsAverage(req.body.userId);
    if(!res1){
        return res.json(false)
    }else{
        return res.json([...res1])
        // return res1
    }
})

// router.post('/deletefewstudents', async function (req, res, next) {
//     let res1 = await StudentsBL.addOrUpdateStudentPhoto(req.body.photo,req.body.studentId);
//     if (!res1) {
//         return res.json(false)
//     } else {
//         return res.json(res1)
//     }
// });






module.exports = router;