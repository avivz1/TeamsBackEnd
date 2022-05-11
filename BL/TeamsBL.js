const TEAMS_MODEL = require('../Models/TeamsModel');
var StudentsBL = require('../BL/StudentsBL');


const getAllTeamsByUserId = function (userId) {
    return new Promise((resolve, reject) => {
        TEAMS_MODEL.find({}, function (err, teams) {
            if (err) {
                reject(false);
            } else {
                let arr = teams.filter(x => x.User_ID == userId);
                resolve(arr);
            }
        })
    })
}

const addTeam = function (team) {
    return new Promise((resolve, reject) => {

        const t = new TEAMS_MODEL({
            Name: team.name,
            User_ID: team.userID,
            CreatedDate: new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate(),
            Type: team.type,
            City: team.city,
        });

        t.save(function (err, CreatedTeam) {
            if (err) {
                reject(false);
            } else {
                resolve(CreatedTeam._id);
            }
        })
    })
}

const updateTeam = function (team) {
    return new Promise((resolve, reject) => {
        TEAMS_MODEL.findByIdAndUpdate(team._id,
            {
                Name: team.name,
                Type: team.type,
                City: team.city,

            }, function (err) {
                if (err) {
                    reject(false);
                } else {
                    resolve(true);
                }
            })
    })
}

const deleteTeam = function (id) {
    return new Promise((resolve, reject) => {
        TEAMS_MODEL.findByIdAndDelete(id, function (err) {
            if (err) {
                reject(err);
            } else {
                resolve(true);
            }
        })
    })
}

const getTeam = function (id) {
    return new Promise((resolve, reject) => {
        TEAMS_MODEL.findById(id, function (err, team) {
            if (err) {
                reject(false);
            } else {
                resolve(team);
            }
        })
    })
}

const getStudentsDistributionByTeam = async function (userId) {
    let allTeams = await getAllTeamsByUserId(userId);
    let allStudents = await StudentsBL.getAllStudentsByUserID(userId);

    let finishedArr = allTeams.map(team => {
        let obj = {
            name: team.Name,
            studQuantity: 0
        }
        allStudents.forEach(stu => {
            if (stu.Team_ID.toString() == team._id.toString()) {
                obj.studQuantity = obj.studQuantity + 1;
            }
        })
        return obj;
    });
    if (finishedArr.length > 0) {
        return finishedArr;
    } else {
        return false;
    }
}

const deleteFewTeams = async function (teams) {
    return new Promise((resolve,reject)=>{
        TEAMS_MODEL.deleteMany({_id:{$in:teams}},function(err){
            if(err){
                reject(false);
            }else{
                resolve(true)
            }
        })
    })
}

module.exports = {deleteFewTeams, getStudentsDistributionByTeam, addTeam, updateTeam, deleteTeam, getTeam, getAllTeamsByUserId }
