const { createToken } = require("../Middlewares/CreateToken");
const { userCreateServices, userLoginServices } = require("../Services/userServices");
const bcrypt = require('bcrypt');

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

// ------login user-----
exports.userLoginController = async (req,res)=>{
    try {
         const {email,password:pass} = req.body
         if(!email || !pass){
            return res.status(400).send({
                status:false,
                message:"Please provide all the fields"
            })
         }
         const user = await userLoginServices(email)
        //  ------not get user 
        if(!user){
            return res.status(500).send({
                status:false,
                message:"Password Not get"
            })
        }
        //  ------not get user 
         const comparepassword =  await bcrypt.compare(pass,user.password)
        //  ------ComparePassword
        if(!comparepassword){
            return res.status(400).send({
                status:false,
                message:"Password not match"
            })
            //  ------ComparePassword
         }
         const token = createToken(user)
         if(!token){
            return res.status(400).json({
                success: false,
                message: "Invalid credentials"
            })
         }
         user.token = token;
         user.save()
        //  ------send user data in frontend without password
         const {password,...rest} = user._doc
        res.status(200).json({
            success: true,
            data:rest
        })
    } catch (error) {
        res.status(500).send({
            status:false,
            message:error.message
        })
    }
}
// ------login user-----