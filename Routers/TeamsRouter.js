const { response } = require('express');
var express = require('express');
var router = express.Router();
var TeamsBL = require('../BL/TeamsBL');
var PracticeBL = require('../BL/PracticesBL');


//return true
router.post('/editteam',async function(req, response, next) {
    let res = await TeamsBL.updateTeam(req.body);
    if(res){
        return response.json(true)
    }else{
        return response.json(false)
    }
})
//return teamID
router.post('/addteam',async function(req, response, next) {

    let res = await TeamsBL.addTeam(req.body);
    if(res){
        return response.json(true);
    }else{
        return response.json(false);
    }
    
})
//return all teams
router.post('/getalluserteams',async function(req, response, next) {

    let res = await TeamsBL.getAllTeamsByUserId(req.body.userID);
    if(res){
        return response.json(res);
    }else{
        return response.json(false)
    }
})
//return team
router.post('/getteam',async function(req, response, next) {

    let res = await TeamsBL.getTeam(req.body.teamId);
    if(res){
        return response.json(res);
    }else{
        return response.json("Error")
    }
})

router.post('/deleteteam',async function(req, response, next) {
    let team =  await TeamsBL.getTeam(req.body.teamId)
    let deleteRes = await PracticeBL.deleteTeamFromPractice(team,req.body.userId)
    let res = await TeamsBL.deleteTeam(req.body.teamId);
    if(res){
        return response.json(res);
    }else{
        return response.json(false)
    }
})

router.post('/getdistributionbyTeam',async function(req,response,next){
    let res = await TeamsBL.getStudentsDistributionByTeam(req.body.userId);
    if(res!=false){
        response.json(res);
    }else{
        response.json(false);
    }

})

    module.exports = router;

