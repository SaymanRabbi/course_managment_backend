const { courseCreateService } = require("../Services/courseServices");

exports.createCourseController = async (req, res) => {
    try {
        const { title,description,modules} = req.body;
        const { _id } = req.userData;
        if(!title || !description  || !modules){
            return res.status(400).send({
                status:false,
                message:'Please fill all required fields'
            })
        }
        const data = {
            title,
            description,
            teacherID:_id,
            modules
        }
        const course = await courseCreateService(data);
        if(!course){
            return res.status(400).send({
                status:false,
                message:'Course not created'
            })
        }
        res.status(200).send({
            status:true,
            message:'Course created successfully',
            data:course
        })
    } catch (error) {
        res.status(500).send({
            status:false,
            message:error.message
        })  
    }
}