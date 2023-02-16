const USERS_MODEL = require('../Models/UsersModel');

//this func should get token as well
const validateUserForDbReset = async function (id, password) {
    let user = await getUserById(id)
    if (user.length > 0) {

        if (user[0].Password == password) {
            return true;
        } else {
            return false;
        }


    }

}

const deleteUser = async function (id) {
    return new Promise((resolve, reject) => {
        USERS_MODEL.findByIdAndDelete(id, function (err) {
            if (err) {
                reject(err)
            } else {
                resolve(true)
            }
        }) // executes

    })
}

const getUserID = async function (email, password) {
    let users = await getAllUsers();
    let user = users.filter(x => x.Email == email && x.Password == password);
    if (user.length > 0) {
        return user[0]._id;
    } else {
        return false;
    }

};

const addNewUser = async function (userData) {
    return new Promise((resolve, reject) => {
        const user = new USERS_MODEL({
            Email: userData.inputEmail,
            Password: userData.inputPassword,
            SecurityQuestion: userData.securityQ,
            SecurityAnswer: userData.securityA,
            CreatedDate: new Date().getDate() + '/' + (new Date().getMonth() + 1 + '/' + new Date().getFullYear()),
        })
        user.save(function (err, newUser) {
            if (err) {
                reject(false);
            } else {
                resolve(newUser._id);
            }
        })
    })
};

const getAllUsers = function () {
    return new Promise((resolve, reject) => {
        USERS_MODEL.find({}, function (err, users) {
            if (err) {
                reject(err);
            } else {
                resolve(users);
            }
        })
    })
};

const isUserExists = async function (email, password) {
    return new Promise((resolve, reject) => {
        USERS_MODEL.find({Password:password,Email:email}, function (err, user) {
            if (err) {
                reject(false);
            } else {
                resolve(user[0]._id);
            }
        })
    })

    // let users = await getAllUsers();
    // let user = users.filter(x => x.Password == password && x.Email == email);
    // if (user.length > 0) {
    //     return user[0]._id;
    // } else {
    //     return false;
    // }

};

const isEmailAvailableToUpdate = async function (userId, email) {
    let users = await getAllUsers();
    let flag = true;

    let usersWithOutCurrentUser = users.filter(u => u._id != userId)
    usersWithOutCurrentUser.forEach(us => {
        if (us.Email == email) {
            flag = false;
        }
    })
    return flag;
}

const isEmailAvailable = async function (email) {
    let users = await getAllUsers();
    let flag = true;

    users.forEach(user => {
        if (user.Email == email) {
            flag = false;
        }
    })
    return flag;
};

const getUserById = async function (userId) {
    return new Promise((resolve, reject) => {
        USERS_MODEL.findById(userId , function (err, user) {
            if (err) {
                reject(err);
            } else {
                resolve(user);
            }
        })
    })
}

const getUserLoginDetails = async function (id) {
    let user = await getUserById(id);
    if (user) {
        return user;
    } else {
        return false;
    }
}

const updateUserCredentials = async function (user) {
    return new Promise(async (resolve, reject) => {
        let status = await isEmailAvailableToUpdate(user.userId, user.Email)
        if (status) {
            USERS_MODEL.findOneAndUpdate(user.userId, {
                "$set":
                {
                    Email: user.email,
                    Password: user.password,
                    SecurityQuestion: user.securityQuestion,
                    SecurityAnswer: user.securityAnswer
                }
            }, function (err, data) {
                if (err) {
                    reject(false);
                } else {
                    resolve(data);
                }
            })
        } else {
            reject(false);
        }
    })
}

const forgotPassword = async function (user) {
    return new Promise((resolve, reject) => {
        USERS_MODEL.find({Email:user.userEmail,SecurityQuestion:user.securityQ,SecurityAnswer:user.securityA }, function (err, user) {
            if (err) {
                reject(false);
            } else {
                if(user.length>0){
                    resolve(user[0].Password);
                }else{
                    resolve(false)
                }
            }
        })
    })

}

module.exports = { isEmailAvailableToUpdate, forgotPassword, updateUserCredentials, validateUserForDbReset, getUserLoginDetails, getUserById, isUserExists, getAllUsers, addNewUser, deleteUser, getUserID, isEmailAvailable }