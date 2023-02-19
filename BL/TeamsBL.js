const TEAMS_MODEL = require('../Models/TeamsModel');
var StudentsBL = require('../BL/StudentsBL');


const getAllTeamsByUserId = function (userId) {
    return new Promise((resolve, reject) => {
        TEAMS_MODEL.find({ User_ID: userId }, function (err, teams) {
            if (err) {
                reject(false);
            } else {
                // let arr = teams.filter(x => x.User_ID == userId);
                resolve(teams);
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
        if (obj.studQuantity == 0) {
            return obj;
        } else {
            obj.studQuantity = ((obj.studQuantity / allStudents.length) * 100).toFixed(2)
            return obj;
        }
    });
    if (finishedArr.length > 0) {
        return finishedArr;
    } else {
        return false;
    }
}

const deleteFewTeams = async function (teams) {
    return new Promise((resolve, reject) => {
        TEAMS_MODEL.deleteMany({ _id: { $in: teams } }, function (err) {
            if (err) {
                reject(false);
            } else {
                resolve(true)
            }
        })
    })
}

const addOrUpdateTeamPhoto = async function (photo, teamId) {
    return new Promise((resolve, reject) => {
        TEAMS_MODEL.findByIdAndUpdate(teamId, {
            Image: photo
        }, function (err) {
            if (err) {
                reject(false);
            } else {
                resolve(true)
            }
        })
    })

}

const resetDb = async function (userId) {
    return new Promise((resolve, reject) => {
        TEAMS_MODEL.deleteMany({ User_ID: userId }, function (err) {
            if (err) {
                reject(err)
            } else {
                resolve(true)
            }
        })

    })
}

const isTeamNameAvailable = async function (name) {
    return new Promise((resolve, reject) => {
        TEAMS_MODEL.find({ Name: name }, function (err, item) {
            if (err) {
                reject(false)
            } else {
                if (item.length > 0) {
                    resolve(false)
                } else {
                    resolve(true)
                }
            }
        })
    })
}

const isNameMatchToDBTeamName = async function (teamId, teamName) {
    return new Promise((resolve, reject) => {
        TEAMS_MODEL.find({ Name: teamName, _id: teamId }, function (err, item) {
            if (err) {
                reject(false)
            } else {
                if (item.length > 0) {
                    resolve(true)
                } else {
                    resolve(false)
                }
            }
        })
    })
}


module.exports = { isNameMatchToDBTeamName, isTeamNameAvailable, resetDb, addOrUpdateTeamPhoto, deleteFewTeams, getStudentsDistributionByTeam, addTeam, updateTeam, deleteTeam, getTeam, getAllTeamsByUserId }
