const Profile = require("../models/Profile")
const User = require("../models/User")

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
            message:"Profile updated successfully".
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
        //get id
        const id = req.user.id
        //validation
        const userDetails = await User.findById(id)
        if(!userDetails){
            return res.status(200).json({
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
        return res(200).json({
            success:true,
            message:"Account deleted successfully"

        })

    } catch (error) {
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
            success:false,
            message:"User data fetch successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Internal server error"
        })
    }
}