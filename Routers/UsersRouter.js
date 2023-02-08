var express = require('express');
var router = express.Router();
var usersBL = require('../BL/UsersBL');



router.post('/updateuserdetails', async function (req, res, next) {
  let resp = await usersBL.updateUserCredentials(req.body);
  if (resp) {
    console.log(resp)
    res.json(resp);
  } else {
    res.json(false);
  }

})

module.exports = router;
