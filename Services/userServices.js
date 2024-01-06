const UserModel = require("../Models/UserModel");
const sendMail = require("../utils/sendMail");


exports.userCreateServices= async (user) => {
    try {
        const userCreated = (await UserModel.create(user)).save();
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
// -----update user role------
exports.updateUserServices = async (id,role)=>{
    try {
        const oldUser = await UserModel.findById(id);
        const updateUser = await UserModel.findByIdAndUpdate(id, { role }, { new: true, useFindAndModify: false });
        if (updateUser) {
            // Check if the role was actually updated
            if (oldUser.role !== updateUser.role) {
                await sendMail(updateUser);
                return updateUser
            } else {
               return null
            }
        } else {
            return null
        }
        
    } catch (error) {
        throw error
    }
}