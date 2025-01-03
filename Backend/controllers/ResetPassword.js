const User = require("../models/User")
const mailSender = require("../utils/mailSender")
const bcrypt = require("bcrypt")

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
                                 resetpasswordExpire:Date.now() + 5*60*1000
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
exports.resetPassword = async(rea,res) =>{
    try {
        //Data fetch
        const {password,confirmPassword,token} = req.body

        //validation
        if(password !== confirmPassword){
            return res.status(400).json({
                success:false,
                message:"Password and confirm password should be same"
            })
        }
        //get userDetail from DB using token
        const userDetails = await User.findOne({token:token})

        //if no entry - invalid token
        if(!userDetails){
            return res.status(400).json({
                success:false,
                message:"Invalid token"  
            })
        }

        //token time check
        if(userDetails.resetPasswordExpires < Date.now()){
            return res.status(400).json({
                success:false,
                message:"Token expired"
            })
        }

        //hash pwd
        const hashedPassword = await bcrypt.hash(password,10)

        //password Update
        await User.findOneAndUpdate(
            {token:token},
            {password:hashedPassword},
            {new:true}
        )
        //return response
        return res.status(200).json({
            success:true,
            message:"Password updated successfully"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"Something went Wrong!"
            })
    }
}