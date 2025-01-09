const User = require("../models/User")
const OTP = require("../models/OTP")
const otpGenerator = require("otp-generator")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const mailSender = require("../utils/mailSender")

require("dotenv").config()

// send OTP for Email Verification
const sendOTP = async (req,res) => {
        try {
            // fetch email from request body
            const {email} = req.body

            // check user exist or not
            const checkUserPresent = await User.findOne({email})

            //if user exist then rerurn response
            if(checkUserPresent){
                return res.status(401).json({
                    success:true,
                    message:"User is Already Registered"
                })
            }

            //generate OTP
            var otp = otpGenerator.generate(6,{
                upperCaseAlphabets:false,
                specialChars:false,
                lowerCaseAlphabets:false,
            
            })
            console.log("OTP is :-",otp)

            //check unique otp or not
            const result = await OTP.findOne({otp:opt})
            
            while(result){
                otp = otpGenerator.generate(6,{
                    upperCaseAlphabets:false,
                    specialChars:false,
                    lowerCaseAlphabets:false,
                })
            }

            const otpPayload = {email,otp}
            
            //create an entry in DB fro OTP
            const otpBody = await OTP.create(otpPayload)
            console.log(otpBody)
            res.status(200).json({
                success:true,
                message:"OTP send Successfully",
                otp
            })

        } catch (error) {
            console.log(error)
            res.status(500).json({
                success:flase,
                message:error.message
            })            
        }
}



// Signup Controller for Registering USers

exports.signup = async (req,res)=>{
    try {
        // Destructure fields from the request body
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
            contactNumber,
            otp,
            } = req.body

            
        // validate data
        if(!firstName || !lastName || !email || !password || !confirmPassword || !otp){
            return res.status(403).json({
                success:false,
                message:"Please fill all the fields"
            })
        }


        // both password matched or not
        if(password !== confirmPassword){
            return res.status(400).json({
                success:flase,
                message:"Password and Confirm Password does not match"
            })
        }


        // check user already exist or not
        const existingUser = await User.findOne({email})
        if(existingUser){
            return res.status(400).json({
                success:false,
                message:"User already exists. please sign in to Continue"
            })
        }                                          
        
        
        // find most recent OTP stored for the email
        const recentOtp = await OTP.find({email}).sort({createdAt:-1}).limit(1)
        console.log(recentOtp)


        // validate OTP
        if(recentOtp.length === 0){
            //OTP not found
            return res.status(400).json({
                success:false,
                message:"OTP Not Found"
            })
        }else if(otp !== recentOtp[0].otp){
            //Invalid OTP
            return res.status(400).json({
                success:false,
                message:"Invalid OTP"
            })
        }


        // Has Password
        const hasedPassword = await bcrypt.hash(password,10)


        // Create the user
        let approved = ""
        approved ==="Instructor" ? (approved = false) : (approved = true)
        
        // create the additional profile for User

        const profileDetails = await Profile.create({
            gender:null,
            dateOfBirth:null,
            about:null,
            contactNumber:null
        })

        const user = await User.create({
            firstName,
            lastName,
            email,
            contactNumber,
            password:hasedPassword,
            accountType:accountType,
            approved:approved,
            additionalDetails:profileDetails._id,
            image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`

        })

        
        // Return response
        return res.status(200).json({
            success:true,
            message:"User Registered Successfully",
            user
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"User not registerd Try Again"
        })
    }
}



// Login controller for authenticating users
exports.login = async (req,res)=>{
    try {
        //Data fetch from request body
    const {email,password} = req.body

    // Data validation
    if(!email || !password){
        return res.status(401).json({
            success:false,
            message:"Please enter email and password" 
        })
    }
    
    // check user exist or not
    const user = await User.findOne({email}).populate("additionalDetails")
    if(!user){
        return res.status(401).json({
            success:false,
            message:"User not registered ! SIGNUP first"
        })
    }

    // Generate JWT after password matching
    if(await bcrypt.compare(password,user.password)){

        const payload = {
            email : user.email,
            id:user._id,
            accounType:user.accountType
        }
        const token = jwt.sign(payload,process.env.JWT_SECRET,{
            expiresIn:"24h"
        })
        user.token = token
        user.password = undefined
        
        //create cookie and send response
        const options = {
            expires: new Date(Date.now() + 3*24*60*60*1000),
            httpOnly:true
        }
        res.cookie("token",token,options).status(200).json({
            success:true,
            token,
            user,
            message:"Login Successfull"
        })
    } else {
        return res.status(401).json({
            success:false,
            message:"Password incorrect"
        })
    }
    } catch (error) {
       console.log(error)
       return res.status(500).json({
        success:false,
        message:"login failed try again"
       }) 
    }

}

//Controller for Changing Password

exports.changePassword = async (req,res)=>{
   try {
         //get data from req.body
    const userDetails = await User.findOne(req.useer.id)

    //get oldPassword , newPassword , confirmNewPassword
    const {oldPassword,newPassword,confirmPassword} = req.body

    //validation on password
    const isPasswordMatch = await bcrypt.compare(oldPassword,userDetails.password)
    if(!isPasswordMatch){
        return res.status(401).json({
            success:false,
            message:"The password is incorrect"
        })
    }

    //update password in DB
    const encryptedpassword = await bcrypt.hash(newPassword,10)
    const updatedUserDetails = await User.findByIdAndUpdate(
        req.user.id,
        {password:encryptedpassword},
        {new:true}
    )
    //send notification to email
    try {
        const emailResponse = await mailSender(
            updatedUserDetails.email,
            passwordUpdated(
                updatedUserDetails.email,
                `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
            )
        )
        console.log("Email sent successfully",emailResponse.response)
    } catch (error) {
        // If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
			console.error("Error occurred while sending email:", error);
			return res.status(500).json({
				success: false,
				message: "Error occurred while sending email",
				error: error.message,
			});
    }
    //return response
    return res.status(200).json({
        success: true,
        message: "Password updated successfully",
    })
   } catch (error) {
    // If there's an error updating the password, log the error and return a 500 (Internal Server Error) error
		console.error("Error occurred while updating password:", error);
		return res.status(500).json({
			success: false,
			message: "Error occurred while updating password",
			error: error.message,
		});
   }
}

