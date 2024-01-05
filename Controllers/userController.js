const { userCreateServices } = require("../Services/userServices");

exports.userCreateController = async (req, res, next) => {
    try {
        // -------get name email password from req.body
         const {name,email,password} = req.body
        //  ------check if name email password is empty or not
         if(!name || !email || !password){
             return res.status(400).send({
                 status:false,
                 message:"Please provide all the fields"
             })
         }
        //  ------send req.body in services-----
     const user = await userCreateServices(req.body);
     if(!user){
         return res.status(500).send({
             status:false,
             message:"Something went wrong"
         })
     }
    //  send created user data in frontend
    res.status(200).send({
            status:true,
            message:"User created successfully",
            data:user
        })
    } catch (error) {
        res.status(500).send({
            status:false,
            message:error.message
        })
    }
}