const CourseModel = require("../Models/CourseModel");

exports.courseCreateService = async (course) => {
    try {
        const saveCourse = (await CourseModel.create(course)).save();
        return saveCourse;
    } catch (error) {
        throw new Error(error.message);
    }
}