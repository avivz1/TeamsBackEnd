const USERS_MODEL = require('../Models/UsersModel');

const updateUser = async function (id, user) {
    return new Promise((resolve, reject) => {
        USERS_MODEL.findOneAndUpdate(id, {
            Email: user.email,
            Password: user.password

        }, function (err) {

            if (err) {
                reject(err);
            } else {
                resolve(true)
            }
        })

    })

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
        return "Error";
    }

};

const addNewUser = async function (userData) {
    return new Promise((resolve, reject) => {
        const user = new USERS_MODEL({
            Email: userData.inputEmail,
            Password: userData.inputPassword,
            SecurityQestion:userData.securityQ,
            SecurityAnswer:userData.securityA,
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
    let users = await getAllUsers();
    let user = users.filter(x => x.Password == password && x.Email == email);
    if (user.length > 0) {
        return user[0]._id;
    } else {
        return false;
    }

};

const isUserNameAvailable = async function (email) {
    let users = await getAllUsers();
    let flag = true;

    users.forEach(user => {
        if (user.Email == email) {
            flag = false;
        }
    })
    return flag;
};

const getUserById = async function (userId){
    return new Promise((resolve, reject) => {
        USERS_MODEL.find({userId}, function (err, user) {
            if (err) {
                reject(err);
            } else {
                resolve(user);
            }
        })
    })
}

const getUserLoginDetails = async function (id){
    let users = await getAllUsers();
    let user = users.filter(x => x._id.toString() == id.toString());
    if (user.length > 0) {
        return user[0];
    } else {
        return false;
    }
}

const resetDb = async function (){
    return new Promise((resolve,reject)=>{
        USERS_MODEL.deleteMany({},function(err){
            if(err){
                reject(err)
            }else{
                resolve(true)
            }
        })

    })
}

module.exports = {resetDb,getUserLoginDetails,getUserById, isUserExists, getAllUsers, addNewUser, updateUser, deleteUser, getUserID, isUserNameAvailable }