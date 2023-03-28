var express = require('express');
var router = express.Router();
var PracticeBL = require('../BL/PracticesBL');
var StudentsBL = require('../BL/StudentsBL');


router.post('/deletepractice', async function (req, res, next) {
    let respo;
    let res1;
    try {
        respo = await PracticeBL.deletePractice(req.body.practice._id)
    } catch (e) {
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            data: null
        });
    }
    if (respo == true) {

        try {
            res1 = await StudentsBL.deletePracticeFromStudents(req.body.practice._id, req.body.practice.Students);
        } catch (e) {
            res.status(500).json({
                success: false,
                message: 'Internal Server Error',
                data: null
            });
        }
        if (res1 == true) {
            res.status(200).json({
                success: true,
                message: 'Success',
                data: true
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Internal Server Error',
                data: null
            });
        }


    } else {
        res.status(404).json({
            success: false,
            message: 'Resource not found',
            data: null
        });
    }

});

router.post('/getstudentattendants', async function (req, res, next) {
    let respo;
    try {
        respo = await PracticeBL.getStudentAttendants(req.body.userId, req.body.stuId)

        if (respo != false && respo != undefined) {
            res.status(200).json({
                success: true,
                message: 'Success',
                data: respo
            });
            // return res.json(respo)
        } else {
            res.status(404).json({
                success: false,
                message: 'Resource not found',
                data: null
            });
            // return res.json(false)
        }
    } catch (e) {
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            data: null
        });
    }


});

router.post('/addpractice', async function (req, res, next) {
    let practiceID;
    let res2;
    try {
        practiceID = await PracticeBL.addPractice(req.body.practice, req.body.allStudents);
        res2 = await StudentsBL.addPracticeToStudents(practiceID, req.body.chosenStudents)
    } catch (e) {
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            data: null
        });
    }

    if (practiceID != false && res2 != false) {
        res.status(200).json({
            success: true,
            message: 'Success',
            data: true
        });
    } else {
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            data: null
        });
    }

});

router.post('/getallpractices', async function (req, res, next) {
    let resp;
    try {
        resp = await PracticeBL.getAllPractices(req.body.userID);
    } catch (e) {
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            data: null
        });
    }

    if (resp != false) {
        res.status(200).json({
            success: true,
            message: 'Success',
            data: resp
        });
    } else {
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            data: null
        });
    }

});

router.post('/getpractice', async function (req, res, next) {
    let resp;
    try {
        resp = await PracticeBL.getPractice(req.body.p_id);
    } catch (e) {
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            data: null
        });
    }

    if (resp != false) {
        res.status(200).json({
            success: true,
            message: 'Success',
            data: resp
        });
    } else {
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            data: null
        });
    }


    // try{

    // }catch(e){

    // }

    // let resp = await PracticeBL.getPractice(req.body.p_id);
    // if (resp != false) {
    //     return res.json(resp)
    // } else {
    //     return res.json(false)
    // }

});

router.post('/updatepractice', async function (req, res, next) {
    let resp;
    let response;

    try {
        resp = await PracticeBL.updatePractice(req.body.practice);
        response = await PracticeBL.addOrRemovePracticeFromStudent(req.body.chosenStudents, req.body.allStudents, req.body.practice);
    } catch (e) {
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            data: null
        });
    }

    if (resp != false && response != false) {
        res.status(200).json({
            success: true,
            message: 'Success',
            data: true
        });
    } else if (resp == false) {
        res.status(500).json({
            success: false,
            message: 'Couldnt update Practice.',
            data: null
        });
    } else if (response == false) {
        res.status(500).json({
            success: false,
            message: "Could not handle practice's students",
            data: null
        });
    }
});

router.post('/attendancepercentage', async function (req, res, next) {
    let resp;
    try {
        resp = await PracticeBL.getPracticeAttendancePrecent(req.body.practice, req.body.userId);
    } catch (e) {
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            data: null
        });
    }


    if (resp != false) {
        res.status(200).json({
            success: true,
            message: 'Success',
            data: resp
        });
    } else {
        res.status(404).json({
            success: false,
            message: 'Resource not found',
            data: null
        });
    }
});

router.post('/getstudentlistforpratice', async function (req, res, next) {
    let resp;
    try {
        resp = await PracticeBL.getStudentsList(req.body.practiceId, req.body.students, req.body.userId);
    } catch (e) {
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            data: null
        });
    }
    if (resp != false) {
        res.status(200).json({
            success: true,
            message: 'Success',
            data: resp
        });
    } else {
        res.status(404).json({
            success: false,
            message: 'Resource not Found',
            data: null
        });
    }
});

router.post('/getTotalDivision', async function (req, res, next) {
    try {
        let resp = await PracticeBL.getTotalDivision(req.body.user.id);
        if (resp) {
            res.status(200).json({
                success: true,
                message: 'Success',
                data: resp
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

router.post('/getTotalDivisionByMonth', async function (req, res, next) {
    
    try {
        let resp = await PracticeBL.getTotalDivisionByMonth(req.body.user.id);
        if (resp == false) {
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                data: null
            })
        } else {
            res.status(200).json({
                success: true,
                message: 'Success',
                data: resp
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

router.post('/removeFewPractices', async function (req, res, next) {
    let resp;
    try {
        resp = await PracticeBL.deleteFewPractices(req.body.practices);
    } catch (e) {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            data: null
        })
    }
    if (resp == true) {
        res.status(200).json({
            success: true,
            message: 'Internal server error',
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


module.exports = router;
