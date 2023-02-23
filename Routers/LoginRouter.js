var express = require('express');
var router = express.Router();
var usersBL = require('../BL/UsersBL');
var StudentsBL = require('../BL/StudentsBL');
var PracticeBL = require('../BL/PracticesBL');
var TeamsBL = require('../BL/TeamsBL');


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
                data: {}
            });
        }

    } catch (e) {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            data: {}
        });
    }
})

router.post('/', async function (req, res, next) {
    try {
        let userDetails = await usersBL.isUserExists(req.body.inputEmail, req.body.inputPassword);
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
                data: {}
            });
        }

    } catch (e) {
         res.status(500).json({
            success: false,
            message: 'Internal server error',
            data: {}
        });
        
    }

});



router.post('/signup', async function (req, res, next) {
    try{
        let isUserAvailable = await usersBL.isEmailAvailable(req.body.inputEmail);
        console.log(isUserAvailable)
        if(!isUserAvailable==true){

            res.status(200).json({
                success: true,
                message: 'Email is not available',
                data: {}
            });
        }else{
            res.status(200).json({
                success: true,
                message: 'Email is available',
                data: {}
            });
        }

    }catch(e){

    }

    // let isUserAvailable = await usersBL.isEmailAvailable(req.body.inputEmail);
    // if (!isUserAvailable) {
    //     return res.json(false);
    // } else {
    //     let newUserID = await usersBL.addNewUser(req.body);
    //     if (newUserID) {
    //         return res.json(newUserID);
    //     } else {
    //         return res.json(false)
    //     }
    // }

});

router.post('/backupdb', async function (req, res, next) {
    let practices = await PracticeBL.getAllPractices(req.body.userId);
    let teams = await TeamsBL.getAllTeamsByUserId(req.body.userId);
    let students = await StudentsBL.getAllStudentsByUserID(req.body.userId);

    return res.json([practices, teams, students]);


});

router.post('/adddata', async function (req, res, next) {
    let team1_obj = {
        name: 'Judo Power',
        userID: req.body.userId,
        type: '12',
        city: 'Kfar Saba',
    }
    let team2_obj = {
        name: 'Champions',
        userID: req.body.userId,
        type: '10',
        city: 'Zofim',
    }

    let team1_id = await TeamsBL.addTeam(team1_obj);
    let team2_id = await TeamsBL.addTeam(team2_obj);

    let stu1_obj = {
        userid: req.body.userId,
        teamID: team1_id,
        name: 'Itay',
        belt: 'yellow',
        city: 'Kfar Saba',
        age: 11,
        Image: ''
    }
    let stu2_obj = {
        userid: req.body.userId,
        teamID: team1_id,
        name: 'Yossi',
        belt: 'white',
        city: 'Kfar Saba',
        age: 12,
        Image: ''
    }
    let stu3_obj = {
        userid: req.body.userId,
        teamID: team2_id,
        name: 'Nadav',
        belt: 'blue',
        city: 'Zofim',
        age: 11,
        Image: ''
    }
    let stu4_obj = {
        userid: req.body.userId,
        teamID: team2_id,
        name: 'Tal',
        belt: 'green',
        city: 'Zofim',
        age: 12,
        Image: ''
    }
    let stu1_id = await StudentsBL.addNewStudent(stu1_obj);
    let stu2_id = await StudentsBL.addNewStudent(stu2_obj);
    let stu3_id = await StudentsBL.addNewStudent(stu3_obj);
    let stu4_id = await StudentsBL.addNewStudent(stu4_obj);

    return res.json('OK')

});


module.exports = router;
