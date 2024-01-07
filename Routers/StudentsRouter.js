var express = require('express');
var router = express.Router();
var StudentsBL = require('../BL/StudentsBL');
var PracticeBL = require('../BL/PracticesBL');


router.post('/addstudent', async function (req, res, next) {
    let response;
    try {
        response = await StudentsBL.addNewStudent(req.body);
    } catch (e) {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            data: null
        })
    }
    if (response == true) {
        res.status(200).json({
            success: true,
            message: 'Success',
            data: response
        })
    } else {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            data: null
        })
    }

});

router.post('/addnewstudentactivity', async function (req, res, next) {
    let response;
    try {
        response = await StudentsBL.addNewActivity(req.body);
    } catch (e) {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            data: null
        })
    }
    if (response) {
        res.status(500).json({
            success: true,
            message: 'Success',
            data: response.Activities
        })
    } else {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            data: null
        })
    }

});

router.post('/getFewStudents', async function (req, res, next) {
    let response;
    try {
        response = await StudentsBL.getFewStudentsByPractice(req.body.students);
    } catch (e) {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            data: null
        })
    }
    if (response != false) {
        res.status(200).json({
            success: true,
            message: 'Success',
            data: response
        })
    } else {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            data: null
        })
    }

});

router.post('/deletestudent', async function (req, res, next) {
    let student;
    let deleteStudentFromPractice;;
    let deleteStudent;
    try {
        student = await StudentsBL.getStudent(req.body.stuId);
        deleteStudentFromPractice = await PracticeBL.deleteStudentFromPractice(student.Name, req.body.stuId, req.body.userId);
        deleteStudent = await StudentsBL.deleteStudentById(req.body.stuId);
    } catch (e) {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            data: null
        })
    }

    let status = student && deleteStudentFromPractice && deleteStudent

    if (status) {
        res.status(200).json({
            success: true,
            message: 'Success',
            data: true
        })
    } else {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            data: null
        })
    }


});

router.post('/deletefewstudents', async function (req, res, next) {
    let students;
    let deletePracStatus;
    let response;
    try {
        students = await StudentsBL.getFewStudents(req.body.students)
        if (students.length > 0) {
            deletePracStatus = await PracticeBL.deleteFewStudentsFromPractices(students, req.body.userId);
            response = await StudentsBL.deleteFewStudents(students);
        } else {
            res.status(404).json({
                success: false,
                message: 'Resource not found',
                data: null
            })
        }

    } catch (e) {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            data: null
        })
    }
    let status = deletePracStatus && response
    if (status) {
        res.status(200).json({
            success: true,
            message: 'Success',
            data: true
        })
    } else {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            data: null
        })
    }

});

router.post('/changestudentsteams', async function (req, res, next) {
    try {
        let response = await StudentsBL.changeStudentsTeam(req.body.teamId, req.body.students);
        if (response == true) {
            res.status(200).json({
                success: true,
                message: 'Success',
                data: true
            })
        } else {
            res.status(404).json({
                success: false,
                message: 'Resource not found',
                data: null
            })
        }

    } catch (e) {
        res.status(500).json({
            success: false,
            message: 'Resource not found',
            data: null
        })
    }

});

router.post('/editstudent', async function (req, res, next) {
    try {
        let response = await StudentsBL.updateStudentSoftDetails(req.body);
        if (response) {
            res.status(200).json({
                success: true,
                message: 'Success',
                data: true
            })
        } else {
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                data: null
            })
        }

    } catch (e) {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            data: null
        })
    }

});

router.post('/getstudentsbyteamid', async function (req, res, next) {
    try {
        let res1 = await StudentsBL.getStudentsByTeamId(req.body.teamId, req.body.userId);
        if (res1 == true) {
            res.status(200).json({
                success: true,
                message: 'Success',
                data: res1
            })
        }
        else {
            res.status(404).json({
                success: false,
                message: 'Resource not found',
                data: false
            })
        }

    } catch (e) {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            data: null
        })

    }
});

router.post('/getallstudentsbyuserid', async function (req, res, next) {
    try {
        let res1 = await StudentsBL.getAllStudentsByUserID(req.body.userid);
        if (res1) {
            res.status(200).json({
                success: true,
                message: 'Success',
                data: res1
            })
        } else {
            res.status(404).json({
                success: false,
                message: 'Resource not found',
                data: res1
            })
        }
    } catch (e) {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            data: null
        })
    }

});

router.post('/addorupdatestudentphoto', async function (req, res, next) {
    try {
        let res1 = await StudentsBL.addOrUpdateStudentPhoto(req.body.photo, req.body.studentId);
        if (res1) {
            res.status(200).json({
                success: true,
                message: 'Success',
                data: res1
            })
        } else {
            res.status(200).json({
                success: false,
                message: 'Resource not found',
                data: false
            })
        }

    } catch (e) {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            data: null
        })
    }
});

router.get('/getBeltsAverage', async function (req, res, next) {
    let res1;
    try {
        res1 = await StudentsBL.getBeltsAverage(req.body.user.id);
    } catch (e) {
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            data: null
        });
    }
    if (res1 == false) {
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            data: null
        });
    } else {
        res.status(200).json({
            success: true,
            message: 'Success',
            data: [...res1]
        });
        // return res.json([...res1])
    }
})

router.post('/deleteactivity', async function (req, res, next) {
    try {
        let resp = await StudentsBL.deleteActivity(req.body);
        if (resp) {
            res.status(200).json({
                success: true,
                message: 'Success',
                data: true
            })
        } else {
            res.status(404).json({
                success: false,
                message: 'Resource not found',
                data: false
            })
        }

    } catch (e) {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            data: null
        })
    }
})

router.post('/getstudentactivities', async function (req, res, next) {
    try {
        let resp = await StudentsBL.getStudentActivities(req.body);
        if (resp.length>0) {
            res.status(200).json({
                success: true,
                message: 'Success',
                data: resp
            })      
          } else {
            res.status(404).json({
                success: false,
                message: 'Resource not found',
                data: false
            })        }

    } catch (e) {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            data: null
        })
    }

})




module.exports = router;