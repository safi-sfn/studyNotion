const Profile = require("../models/Profile")
const User = require("../models/User")
const { uploadImageToCloudinary } = require("../utils/imageUploader")
require("dotenv").config()
exports.updateProfile = async (req,res) => {
    try{
        //get data
        const {dateOfBirth="",about="",contactNumber,gender} = req.body

        //get user
        const id = req.user.id

        //data validation
        if(!contactNumber || !gender || !id){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }
        //find profile
        const userDetails = await User.findById(id)
        const  profileId = userDetails.additionalDetails
        const profileDetails = await Profile.findById(profileId)

        //update profile
        profileDetails.dateOfBirth = dateOfBirth
        profileDetails.about = about
        profileDetails.contactNumber = contactNumber
        profileDetails.gender = gender
       
        await profileDetails.save()

        //return response
        return res.status(200).json({
            success:true,
            message:"Profile updated successfully",
            profileDetails
        })
    } catch(error){
        return res.status(400).json({
            success:false,
            error:error.message,
            message:"Internal server error"
        })
    }
}


//deleteAccount
//how can we schedule this deletion operation  -find:cron job
exports.deleteAccount = async (req,res) => {
    try {
        //TODO : find more on job Schedule
        // const job = schedule.scheduleJob("10 * * * * *",function(){
       // console.log("The answer to life, the universe, and everything") })
        //console.log(job)

        //get id
        const id = req.user.id
        //validation
        const userDetails = await User.findById({_id:id})
        if(!userDetails){
            return res.status(404).json({
                success:false,
                message:"user not found"
            })
        }
        //delete profile
        await  Profile.findByIdAndDelete({_id:userDetails.additionalDetails})
        //TODO: unenroll user from all enrolled courses
        //delete user
        await User.findByIdAndDelete({_id:id})
        //return respone
        return res.status(200).json({
            success:true,
            message:"Account deleted successfully"

        })

    } catch (error) {
        console.log("Backend/controllers/Profile.js",error)
        return res.status(500).json({
            success:false,
            error:error.message,
            message:"Internal server error"
        })
    }
}



exports.getAllUserDetails = async (req,res) => {
    try {
        //get id
        const id = req.user.id
        //get user details and validation
        const userDetails = await User.findById(id).populate("additionalDetails").exec()
        //return response
        return res.status(200).json({
            success:true,
            message:"User data fetch successfully",
            data:userDetails
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Internal server error"
        })
    }
}


exports.updateDisplayPicture = async (req,res) => {
    try {
        const displayPicture = req.files.displayPicture
        const userId = req.user.id
        const image = await uploadImageToCloudinary(
            displayPicture,
            process.env.FOLDER_NAME,
            1000,
            1000
        )
        console.log(image)
        const updatedProfile = await User.findByIdAndUpdate(
            {_id:userId},
            {image:image.secure_url},
            {new:true}
        )
        res.send({
            success:true,
            message:"Display picture updated successfully",
            data:updatedProfile
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}


exports.getEnrolledCourses = async (req,res) => {
    try {
        const userId = req.user.id
        const userDetails = await User.findOne({
            _id:userId,
        })
        .populate("courses")
        .exec()
        if(!userDetails){
            return res.status(400).json({
                success:false,
                message:`Could not find user with id: ${userDetails}`,
            })
        }
        return res.status(200).json({
            success:true,
            data:userDetails.courses,
            message:"Courses retrieved successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}