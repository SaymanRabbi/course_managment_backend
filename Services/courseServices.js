const CourseModel = require("../Models/CourseModel");

exports.courseCreateService = async (course) => {
    try {
        const saveCourse = (await (await CourseModel.create(course)).save())
        // .populate('teacherID');
        return saveCourse;
    } catch (error) {
        throw new Error(error.message);
    }
}