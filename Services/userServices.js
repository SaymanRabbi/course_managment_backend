const UserModel = require("../Models/UserModel");


exports.userCreateServices= async (user) => {
    try {
        const newUser = new UserModel(user);
        const userCreated = await newUser.save();
        return userCreated;
    } catch (error) {
        throw error;
    }
}

// -----get userLoginServices------
exports.userLoginServices = async (email)=>{
    try {
        const getUser = await UserModel.findOne({
            email
        })
        return getUser
    } catch (error) {
        throw error
    }
}
// -----get userLoginServices------