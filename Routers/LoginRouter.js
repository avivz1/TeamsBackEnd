var express = require('express');
var router = express.Router();
var usersBL = require('../BL/UsersBL');
var StudentsBL = require('../BL/StudentsBL');
var PracticeBL = require('../BL/PracticesBL');
var TeamsBL = require('../BL/TeamsBL');




router.post('/', async function (req, res, next) {
    let isExistsResponse = await usersBL.isUserExists(req.body.inputEmail, req.body.inputPassword);
    return res.json(isExistsResponse);

});

router.post('/adddata', async function (req, res, next) {
    let team1_obj = {
        name: 'Judo Power',
        userID: req.body.userId,
        type: '10-12',
        city: 'Kfar Saba',
    }
    let team2_obj = {
        name: 'Champions',
        userID: req.body.userId,
        type: '6-10',
        city: 'Zofim',
    }

    let team1_id = await TeamsBL.addTeam(team1_obj);
    let team2_id = await TeamsBL.addTeam(team2_obj);

    let stu1_obj = {
        userid: req.body.userId,
        teamID: team1_id,
        name: 'Itay',
        belt: 'Yellow',
        city: 'Kfar Saba',
        age: 11,
        Image:''
    }
    let stu2_obj = {
        userid: req.body.userId,
        teamID: team1_id,
        name: 'Yossi',
        belt: 'White',
        city: 'Kfar Saba',
        age: 12,
        Image:''
    }
    let stu3_obj = {
        userid: req.body.userId,
        teamID: team2_id,
        name: 'Nadav',
        belt: 'Blue',
        city: 'Zofim',
        age: 11,
        Image:''
    }
    let stu4_obj = {
        userid: req.body.userId,
        teamID: team2_id,
        name: 'Tal',
        belt: 'Green',
        city: 'Zofim',
        age: 12,
        Image:''
    }
    let stu1_id = await StudentsBL.addNewStudent(stu1_obj);
    let stu2_id = await StudentsBL.addNewStudent(stu2_obj);
    let stu3_id = await StudentsBL.addNewStudent(stu3_obj);
    let stu4_id = await StudentsBL.addNewStudent(stu4_obj);


});

router.post('/signup', async function (req, res, next) {
    let isUserAvailable = await usersBL.isUserNameAvailable(req.body.inputEmail);
    if (!isUserAvailable) {
        return res.json(false);
    } else {
        let newUserID = await usersBL.addNewUser(req.body.inputEmail, req.body.inputPassword);
        if (newUserID) {
            return res.json(newUserID);
        } else {
            return res.json(false)
        }
    }

});



module.exports = router;
