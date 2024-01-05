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