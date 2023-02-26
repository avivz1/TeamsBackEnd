var express = require('express');
var router = express.Router();
var usersBL = require('../BL/UsersBL');
var StudentsBL = require('../BL/StudentsBL');
var PracticeBL = require('../BL/PracticesBL');
var TeamsBL = require('../BL/TeamsBL');

router.post('/resetdb', async function (req, res, next) {
  let valid = await usersBL.validateUserForDbReset(req.body.userId,req.body.password)
  if (valid) {
      let stuStatus = await StudentsBL.resetDb(req.body.userId);
      let pracStatus = await PracticeBL.resetDb(req.body.userId);
      let teamStatus = await TeamsBL.resetDb(req.body.userId);
      if (stuStatus && pracStatus && teamStatus) {
          return res.json(true)
      } else {
          return res.json(false)
      }
  } else {
      return res.json(false)
  }

});

router.post('/updateuserdetails', async function (req, res, next) {
  try{

    let resp = await usersBL.updateUserCredentials(req.body);
    if (resp) {
      res.json(resp);
    } else {
      res.json(false);
    }

  }catch(e){
    res.json(false)
  }

})

router.post('/forgotpassword', async function (req, res, next) {
  let resp = await usersBL.forgotPassword(req.body.user);
  if (resp) {
    res.json(resp);
  } else {
    res.json(false);
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

module.exports = router;
