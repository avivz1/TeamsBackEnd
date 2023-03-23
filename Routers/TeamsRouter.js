const { response } = require('express');
var express = require('express');
var router = express.Router();
var TeamsBL = require('../BL/TeamsBL');
var PracticeBL = require('../BL/PracticesBL');
var StudentsBL = require('../BL/StudentsBL')


router.post('/editteam', async function (req, response, next) {
    try {
        let nameForEditStatus = await TeamsBL.isNameMatchToDBTeamName(req.body._id, req.body.name)
        if (nameForEditStatus) {
            let res = await TeamsBL.updateTeam(req.body);
            if (res) {
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
        } else {
            let nameForAddStatus = await TeamsBL.isTeamNameAvailable(req.body.name);
            if (nameForAddStatus) {
                let res = await TeamsBL.updateTeam(req.body);
                if (res) {
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
            } else {
                res.status(404).json({
                    success: false,
                    message: 'Resource not found',
                    data: false
                })
            }
        }
    } catch (e) {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            data: null
        })
    }
})

router.post('/addteam', async function (req, response, next) {
    let nameStatus;
    let addTeamStatus;
    try {
        nameStatus = await TeamsBL.isTeamNameAvailable(req.body.name)
        if (nameStatus) {
            addTeamStatus = await TeamsBL.addTeam(req.body);
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

    if (addTeamStatus && nameStatus) {
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


})

router.post('/getalluserteams', async function (req, response, next) {
    try {
        let res = await TeamsBL.getAllTeamsByUserId(req.body.userID);
        if (res) {
            res.status(200).json({
                success: true,
                message: 'Success',
                data: res
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

router.post('/getteam', async function (req, response, next) {
    try {
        let res = await TeamsBL.getTeam(req.body.teamId);
        if (res) {
            res.status(200).json({
                success: true,
                message: 'Success',
                data: res
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

router.post('/deleteteam', async function (req, response, next) {
    let team;
    let deleteTeamFromPractice;
    let deleteTeamStatus;
    try {
        team = await TeamsBL.getTeam(req.body.teamId)
        if (team) {
            deleteTeamFromPractice = await PracticeBL.deleteTeamFromPractice(team, req.body.userId)
            if (deleteTeamFromPractice) {
                deleteTeamStatus = await TeamsBL.deleteTeam(req.body.teamId);
            } else {
                response.status(500).json({
                    success: false,
                    message: 'Internal Server Error',
                    data: null
                })
            }
        } else {
            res.status(404).json({
                success: false,
                message: 'Resource not found',
                data: false
            })
        }
    } catch (e) {
        response.status(500).json({
            success: false,
            message: 'Internal Server Error',
            data: null
        })
    }

    let status = deleteTeamFromPractice && deleteTeamStatus;
    if (status) {
        response.status(200).json({
            success: true,
            message: 'Internal Server Error',
            data: deleteTeamStatus
        })
    } else {
        response.status(500).json({
            success: false,
            message: 'Internal Server Error',
            data: null
        })
    }
})

router.get('/getdistributionbyTeam', async function (req, response, next) {
    let res;
    try {
        res = await TeamsBL.getStudentsDistributionByTeam(req.body.user.id);
        if (res == false) {
            response.status(500).json({
                success: false,
                message: 'Internal Server Error',
                data: null
            });
        } else {
            response.status(200).json({
                success: true,
                message: 'Success',
                data: res
            });
            
        }
    } catch (e) {
        response.status(500).json({
            success: false,
            message: 'Internal Server Error',
            data: null
        })
    }


})

router.post('/removeFewTeams', async function (req, response, next) {
    try{
        let res = await TeamsBL.deleteFewTeams(req.body.teams);
        if (res != false) {
            let res1 = await StudentsBL.deleteFewStudentsByTeam(req.body.teams, req.body.userID)

            if (res1 != false) {
                response.status(200).json({
                    success: true,
                    message: 'Success',
                    data: res
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
            })        }
    }catch(e){
        response.status(500).json({
            success: false,
            message: 'Internal Server Error',
            data: null
        })
    }


})

router.post('/addorupdateteamphoto', async function (req, res, next) {
    try {
        let res1 = await TeamsBL.addOrUpdateTeamPhoto(req.body.photo, req.body.teamID);
        if (res1) {
            response.status(200).json({
                success: true,
                message: 'Success',
                data: res1
            })      
          } else {
            response.status(500).json({
                success: false,
                message: 'Internal Server Error',
                data: null
            })        }

    } catch (e) {
        response.status(500).json({
            success: false,
            message: 'Internal Server Error',
            data: null
        })    }

});



module.exports = router;

