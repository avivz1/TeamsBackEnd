var express = require('express');
var router = express.Router();
var usersBL = require('../BL/UsersBL');


router.post('/',async function(req, res, next) {
    //await usersBL.addNewUser('a',1);
    let isExistsResponse = await usersBL.isUserExists(req.body.inputEmail,req.body.inputPassword);
    return res.json(isExistsResponse);
});

router.post('/signup',async function(req, res, next) {
    let isUserAvailable = await usersBL.isUserNameAvailable(req.body.inputEmail);
    if(!isUserAvailable){
        return res.json(false);
    }else{
        let newUserID = await usersBL.addNewUser(req.body.inputEmail,req.body.inputPassword);
        if(newUserID){
            return res.json(newUserID);
        }else{
            return res.json(false)
        }
    }

});



module.exports = router;
