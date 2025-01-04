const Course = require("../models/Course")
const Tag = require("../models/Tags")
const User = require("../models/User")
const uploadImageToCloudinary = require("../utils/imageUploader")
require("dotenv").config()

exports.createCourse = async (req,res) => {
    try {
        //Data fetch
        const {courseName, courseDescription, whatYouWillLearn, price, tag} = req.body

        //get thumbnail
        const thumbnail = req.files.thumbnailImage
        
        //validation
        if(!courseName || !courseDescription || !whatYouWillLearn || !price ||!tag ||!thumbnail){
            return res.status(400).json({
                success:false,
                message:"All Fields are required"
            })
        }

        //check for Instructor
        const userId = req.user.id
        const instructorDetails = await User.findById(userId)
        console.log("Instructor Details",instructorDetails)

        if(!instructorDetails){
            return res.status(404).json({
                success:false,
                message:"Instructor Not Found!"
            })
        }

        //check given tag is valid or not
        const tagDetails = await Tag.findById(tag)
        if(!tagDetails){
            return res.status(404).json({
                success:false,
                message:"Invalid Tag!"
            })
        }

        //upload thumbnail Image too cloudinary
        const thumbnailImage = await uploadImageToCloudinary(thumbnail,process.env.FOLDER_NAME)

        //create an entry for new Course
        const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor:instructorDetails._id,
            whatYouWillLearn:whatYouWillLearn,
            price,
            tag:tagDetails._id,
            thumbnail:thumbnailImage.secure_url
        })

        //add the new course to the user schema of Instructor
        await User.findByIdAndUpdate(
            {_id:instructorDetails._id},
            {
                $push:{
                    courses:newCourse._id
                }
            },
            {new:true}
        )

        return res.status(200).json({
            success:true,
            message:"Course created successfully",
            data:newCourse
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            error:error.message,
            message:"Failed to create course"
        })
    }
}
