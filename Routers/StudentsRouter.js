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
    let re = await PracticeBL.deleteFewStudentsFromPractices(req.body.students, req.body.userId);
    let response = await StudentsBL.deleteFewStudents(req.body.students);
    if (response == true) {
        return res.json(true);
    } else {
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






module.exports = router;