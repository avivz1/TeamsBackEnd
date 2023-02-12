var express = require('express');
var router = express.Router();
var usersBL = require('../BL/UsersBL');



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

module.exports = router;
