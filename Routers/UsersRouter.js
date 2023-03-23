var express = require('express');
var router = express.Router();
var usersBL = require('../BL/UsersBL');
var StudentsBL = require('../BL/StudentsBL');
var PracticeBL = require('../BL/PracticesBL');
var TeamsBL = require('../BL/TeamsBL');

router.post('/resetdb', async function (req, res, next) {
  try {

    let valid = await usersBL.validateUserForDbReset(req.body.userId, req.body.password)
    if (valid) {
      let stuStatus = await StudentsBL.resetDb(req.body.userId);
      let pracStatus = await PracticeBL.resetDb(req.body.userId);
      let teamStatus = await TeamsBL.resetDb(req.body.userId);
      if (stuStatus && pracStatus && teamStatus) {
        response.status(200).json({
          success: true,
          message: 'Success',
          data: true
        })
      } else {
        response.status(500).json({
          success: false,
          message: 'Internal server error',
          data: null
        })
      }
    } else {
      response.status(500).json({
        success: false,
        message: 'Internal server error',
        data: null
      })
    }

  } catch (e) {
    response.status(500).json({
      success: false,
      message: 'Internal server error',
      data: null
    })
  }


});

router.post('/updateuserdetails', async function (req, res, next) {
  try {
    let resp = await usersBL.updateUserCredentials(req.body);
    if (resp) {
      response.status(200).json({
        success: true,
        message: 'Success',
        data: resp
      })

    } else {
      response.status(500).json({
        success: false,
        message: 'Internal server error',
        data: null
      })
    }

  } catch (e) {
    response.status(500).json({
      success: false,
      message: 'Internal server error',
      data: null
    })
  }

})

router.post('/forgotpassword', async function (req, res, next) {
  try {

    let resp = await usersBL.forgotPassword(req.body.user);
    if (resp) {
      response.status(200).json({
        success: true,
        message: 'Success',
        data: resp
      })
    } else {
      response.status(404).json({
        success: false,
        message: 'Resource not found',
        data: false
      })
    }
  } catch (e) {
    response.status(500).json({
      success: false,
      message: 'Internal server error',
      data: null
    })
  }

})

router.post('/backupdb', async function (req, res, next) {
  try {
    let practices = await PracticeBL.getAllPractices(req.user.id);
    let teams = await TeamsBL.getAllTeamsByUserId(req.user.id);
    let students = await StudentsBL.getAllStudentsByUserID(req.user.id);
    if (practices && teams && students) {
      res.status(200).json({
        success: true,
        message: 'Success',
        data: [practices, teams, students]
      });
    }
  } catch (e) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      data: null
    });
  }




});

router.post('/getuserdetails', async function (req, res, next) {
  try {
    let userDetails = await usersBL.getUserById(req.body.userId);
    if (userDetails) {
      res.status(200).json({
        success: true,
        message: 'Success',
        data: userDetails
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'User not found',
        data: null
      });
    }

  } catch (e) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      data: null
    });
  }
})

module.exports = router;
