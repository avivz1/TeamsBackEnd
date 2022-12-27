const { response } = require('express');
var express = require('express');
var router = express.Router();
var TeamsBL = require('../BL/TeamsBL');
var PracticeBL = require('../BL/PracticesBL');
var StudentsBL = require('../BL/StudentsBL')


//return true
router.post('/editteam', async function (req, response, next) {
    let res = await TeamsBL.updateTeam(req.body);
    if (res) {
        return response.json(true)
    } else {
        return response.json(false)
    }
})
//return teamID
router.post('/addteam', async function (req, response, next) {

    let res = await TeamsBL.addTeam(req.body);
    if (res) {
        return response.json(true);
    } else {
        return response.json(false);
    }

})
//return all teams
router.post('/getalluserteams', async function (req, response, next) {

    let res = await TeamsBL.getAllTeamsByUserId(req.body.userID);
    if (res) {
        return response.json(res);
    } else {
        return response.json(false)
    }
})
//return team
router.post('/getteam', async function (req, response, next) {

    let res = await TeamsBL.getTeam(req.body.teamId);
    if (res) {
        return response.json(res);
    } else {
        return response.json("Error")
    }
})

router.post('/deleteteam', async function (req, response, next) {
    let team = await TeamsBL.getTeam(req.body.teamId)
    let deleteRes = await PracticeBL.deleteTeamFromPractice(team, req.body.userId)
    let res = await TeamsBL.deleteTeam(req.body.teamId);
    if (res) {
        return response.json(res);
    } else {
        return response.json(false)
    }
})

router.post('/getdistributionbyTeam', async function (req, response, next) {
    let res = await TeamsBL.getStudentsDistributionByTeam(req.body.userId);
    if (res != false) {
        response.json(res);
    } else {
        response.json(false);
    }

})

router.post('/removeFewTeams', async function (req, response, next) {
    let res = await TeamsBL.deleteFewTeams(req.body.teams);
    if (res != false) {
        let res1 = await StudentsBL.deleteFewStudentsByTeam(req.body.teams, req.body.userID)
        // let deletePracStatus = await PracticeBL.deleteFewStudentsFromPractices(students, req.body.userId);

        if (res1 != false) {
            response.json(res);
        } else {
            response.json(false);
        }
    } else {
        response.json(false);
    }
})

router.post('/addorupdateteamphoto', async function (req, res, next) {
    let res1 = await TeamsBL.addOrUpdateTeamPhoto(req.body.photo,req.body.teamID);
    if (!res1) {
        return res.json(false)
    } else {
        return res.json(res1)
    }
});



module.exports = router;

