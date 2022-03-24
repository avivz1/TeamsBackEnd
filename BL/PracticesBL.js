const PRACTICES_MODEL = require('../Models/PracticeModel')


const getPractice = function (id) {
    return new Promise ((resolve,reject)=>{
        PRACTICES_MODEL.findById(id,function (err,prac){
            if(err){
                reject(false)
            }else{
                resolve(prac)
            }
        })
    })
}

const getAllPractice = function (userid) {
    return new Promise((resolve, reject) => {
        PRACTICES_MODEL.find({}, function (err, practices) {
            if (err) {
                reject(false);
            } else {
                let practicesArr = practices.filter(p => p.User_ID == userid);
                resolve(practicesArr);
            }
        })
    })
}

const addPractice = function (practice) {
    return new Promise((resolve,reject)=>{
        const p = new PRACTICES_MODEL({
            User_ID: practice.userid,
            Team_ID: practice.teamID,
            Name: practice.name,
            PreviousTeam: '',
            PracticeHour: practice.hour,
            PracticeDate: practice.date,
            // new Date().getDate()+'/'+(new Date().getMonth()+1+'/'+new Date().getFullYear())
        })

        p.save(function(err,pra){
            if(err){
                reject(false)
            }else{
                resolve(pra._id)
            }
        })
    })
}

const deletePractice = function (id){
    return new Promise((resolve,reject)=>{
        PRACTICES_MODEL.findByIdAndDelete(id,function(err){
            if(err){
                reject(false)
            }else{
                resolve(true)
            }
        })
    })
}

const updatePractice = function(p_id){
    return new Promise((resolve,reject)=>{

    })
}




module.exports = {updatePractice,deletePractice,getPractice,getAllPractice,addPractice}