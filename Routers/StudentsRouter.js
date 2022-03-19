var express = require('express');
var router = express.Router();
var StudentsBL = require('../BL/StudentsBL');


router.post('/addstudent',async function(req, res, next) {
    let response = await StudentsBL.addNewStudent(req.body);
    if(response){
        return res.json(response);
    }else{
        return res.json(false);
    }
    
});

router.delete('/deletestudent/:id',async function(req, res, next) {
    let response = await StudentsBL.deleteStudentById(req.params.id);
    if(response==true){
        return res.json(true);
    }else{
        return res.json(false);
    }
    
});

router.post('/deletefewstudents',async function(req, res, next) {
    let response = await StudentsBL.deleteFewStudents(req.body.students);
    console.log('RouterRes || ' +JSON.stringify(response))
    if(response==true){
        return res.json(true);
    }else{
        return res.json(false);
    }
    
});

router.post('/changestudentsteams',async function(req, res, next) {
    let response = await StudentsBL.changeStudentsTeam(req.body.teamId,req.body.students);
    if(response==true){
        console.log('3')
        return res.json(true);
    }else{
        console.log('4')

        return res.json(false);
    }
    
});

router.post('/editstudent',async function(req, res, next) {
    let response = await StudentsBL.updateStudentSoftDetails(req.body);
    if(response){
        return res.json(true);
    }else{
        return res.json(false)
    }
    
});

router.post('/getstudentsbyteamid',async function(req, res, next) {
    let res1 =  await StudentsBL.getStudentsByTeamId(req.body.teamId,req.body.userId);
    if(res1){
        return res.json(res1);
    }else{
        return res.json(false);
    }
});

router.post('/getallstudentsbyuserid',async function(req, res, next) {
    let res1 =  await StudentsBL.getAllStudentsByUserID(req.body.userid);
    if(!res1){
        return res.json(false)
    }else{
        return res.json(res1)
    }
});





module.exports = router;