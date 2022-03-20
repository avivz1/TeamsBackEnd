var express = require('express');
var router = express.Router();
var PracticeBL = require('../BL/PracticesBL');
var StudentsBL = require('../BL/StudentsBL');


router.post('/addpractice', async function (req, res, next) {
    let practiceID = await PracticeBL.addPractice(p1);
    if (practiceID != false) {
        let res2 = await StudentsBL.addPracticeToStudents(practiceID, students)
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
    let resp = await PracticeBL.getAllPractice('6218c96b8cb6b14d697738f0');
    if(resp!=false){
        return res.json(resp)
    }else{
        return res.json(false)
    }
    
});

router.post('/getpractice', async function (req, res, next) {
    let resp = await PracticeBL.getPractice('62375052389309d96a87f46c');
    if(resp!=false){
        return res.json(resp)
    }else{
        return res.json(false)
    }
    
});



let p1 = {
    userid: '6218c96b8cb6b14d697738f0',
    teamID: '623747b97b47d0b00fb76ce8',
    name: 'p1',
    PracticeDate: new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate(),
}
let students = [
    {
        _id: "623750d2e0bddae891dbad96",
    }
]






module.exports = router;
