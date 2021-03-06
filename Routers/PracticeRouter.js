var express = require('express');
var router = express.Router();
var PracticeBL = require('../BL/PracticesBL');
var StudentsBL = require('../BL/StudentsBL');


router.post('/deletepractice', async function (req, res, next) {
    //delete the practice
    let respo = await PracticeBL.deletePractice(req.body.practice._id)
    if (respo == true) {

        if (req.body.practice.Students.length > 0) {
            let res1 = await StudentsBL.deletePracticeFromStudents(req.body.practice._id, req.body.practice.Students);
            if (res1 == true) {
                return res.json(true);
            } else {
                return res.json(false);
            }
        }


    } else {
        return res.json(false);
    }

});

router.post('/getstudentattendents', async function (req, res, next) {
    let respo = await PracticeBL.getStudentAttendants(req.body.userId, req.body.stuId)
    if (respo != false) {
        return res.json(respo)
    } else {
        return res.json(false)
    }

});

router.post('/addpractice', async function (req, res, next) {
    let practiceID = await PracticeBL.addPractice(req.body.practice, req.body.allStudents);
    if (practiceID != false) {
        let res2 = await StudentsBL.addPracticeToStudents(practiceID, req.body.chosenStudents)
        if (res2 != false) {
            return res.json(true)
        } else {
            return res.json(false)
        }
    } else {
        return res.json(false)
    }

});

router.post('/getallpractices', async function (req, res, next) {
    let resp = await PracticeBL.getAllPractices(req.body.userID);
    console.log(resp)

    if (resp != false) {
        return res.json(resp)
    } else {
        return res.json(false)
    }

});

router.post('/getpractice', async function (req, res, next) {
    let resp = await PracticeBL.getPractice(req.body.p_id);
    if (resp != false) {
        return res.json(resp)
    } else {
        return res.json(false)
    }

});

router.post('/updatepractice', async function (req, res, next) {
    console.log(req.body.practice)
    let resp = await PracticeBL.updatePractice(req.body.practice);
    let response = await PracticeBL.addOrRemovePracticeFromStudent(req.body.chosenStudents, req.body.allStudents, req.body.practice);
    if (resp != false) {
        return res.json(true)
    } else {
        return res.json(false)
    }
});

router.post('/attendancepercentage', async function (req, res, next) {
    let resp = await PracticeBL.getPracticeAttendancePrecent(req.body.practice, req.body.userId);

    if (resp != false) {
        return res.json(resp)
    } else {
        return res.json(false)
    }
});

router.post('/getstudentlistforpratice', async function (req, res, next) {
    let resp = await PracticeBL.getStudentsList(req.body.practiceId, req.body.students, req.body.userId);
    if (resp != false) {
        return res.json(resp)
    } else {
        return res.json(false)
    }
});

router.post('/getTotalDivision', async function (req, res, next) {
    let resp = await PracticeBL.getTotalDivision(req.body.userId);
    if (resp != undefined || resp != null) {
        return res.json(resp)
    } else {
        return res.json(false)
    }
});

router.post('/getTotalDivisionByMonth', async function (req, res, next) {
    let resp = await PracticeBL.getTotalDivisionByMonth(req.body.userId);
    if (resp != false) {
        return res.json(resp)
    } else {
        return res.json(false)
    }
});

router.post('/removeFewPractices', async function (req, res, next) {
    let resp = await PracticeBL.deleteFewPractices(req.body.practices);
    if (resp==true) {
        return res.json(true)
    } else {
        return res.json(false)
    }
});


module.exports = router;
