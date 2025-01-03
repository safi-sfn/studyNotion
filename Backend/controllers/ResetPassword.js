const User = require("../models/User")
const mailSender = require("../utils/mailSender")

//generate resetPasswordToken
exports.resetPasswordToken = async (req,res) => {
   try {
     //get email from req body
     const email = req.body.email

     //check user for this email , email validation
     const user = await User.findOne({email:email})
     if(!user){
         return res.status(401).json({
             success:false,
             message:"email is not Registered"
         })
     }
 
     //token generate
     const token = crypto.randomUUID()
 
     //update user by adding token and expiration time
     const updatedDetails = await User.findOneAndUpdate(
                             {email:email},
                             {
                                 token:token,
                                 resetpasswordExpire:Date.now() + 30*60*1000
                             },
                             {new:true})
     
     //create url
     const url = `http://localhost:3000/update-password/${token}`
 
     //send mail containong the url
     await mailSender(email,
                 "Reset password Link",
             `click on this link to reset your password ${url}`)
 
     // return response  
     return res.status(200).json({
         success:true,
         message:"Check your registered email to rest your password"
     })
 
   } catch (error) {
    console.log(error)
     return res.status(500).json({
        success:false,
        message:"Something went wrong!"
     })
   }
}
//resetPassword