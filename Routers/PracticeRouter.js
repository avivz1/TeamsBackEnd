var express = require('express');
var router = express.Router();
var PracticeBL = require('../BL/PracticesBL');
var StudentsBL = require('../BL/StudentsBL');


router.post('/deletepractice', async function (req, res, next) {
    //delete the practice
    let respo = await PracticeBL.deletePractice(req.body.practice._id)
    if (respo == true) {

        if(req.body.practice.Students.length>0){
            let res1 = await StudentsBL.deletePracticeFromStudents(req.body.practice._id, req.body.practice.Students);
            if(res1==true){
                return res.json(true);
            }else{
                return res.json(false);
            }
        }


    } else {
        return res.json(false);
    }

});

router.post('/addpractice', async function (req, res, next) {
    let practiceID = await PracticeBL.addPractice(req.body.practice, req.body.allStudents);
    if (practiceID != false) {
        let res2 = await StudentsBL.addPracticeToStudents(practiceID, req.body.chosenStudents)
        if (res2 != false) {
            return res.json(true)
        } else {
            return res.json(false)
        }
    } else {
        return res.json(false)
    }

});

router.post('/getallpractices', async function (req, res, next) {
    let resp = await PracticeBL.getAllPractices(req.body.userID);
    if (resp != false) {
        return res.json(resp)
    } else {
        return res.json(false)
    }

});

router.post('/getpractice', async function (req, res, next) {
    let resp = await PracticeBL.getPractice(req.body.p_id);
    if (resp != false) {
        return res.json(resp)
    } else {
        return res.json(false)
    }

});

router.post('/updatepractice', async function (req, res, next) {
    let resp = await PracticeBL.updatePractice(req.body.practice, req.body.students);

    if (resp != false) {
        return res.json(true)
    } else {
        return res.json(false)
    }
});


// let p1 = {
//     userid: '6218c96b8cb6b14d697738f0',
//     teamID: '623747b97b47d0b00fb76ce8',
//     name: 'p1',
//     PracticeDate: new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate(),
// }
// let students = [
//     {
//         _id: "623750d2e0bddae891dbad96",
//     }
// ]






module.exports = router;
