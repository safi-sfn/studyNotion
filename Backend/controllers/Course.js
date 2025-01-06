const Course = require("../models/Course")
const Category = require("../models/Category")
const User = require("../models/User")
const uploadImageToCloudinary = require("../utils/imageUploader")
require("dotenv").config()

//create Course Handler function
exports.createCourse = async (req,res) => {
    try {
        //Data fetch
        const {courseName, courseDescription, whatYouWillLearn, price, category} = req.body

        //get thumbnail
        const thumbnail = req.files.thumbnailImage
        
        //validation
        if(!courseName || !courseDescription || !whatYouWillLearn || !price ||!category ||!thumbnail){
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

        //check given category is valid or not
        const categoryDetails = await Category.findById(category)
        if(!categoryDetails){
            return res.status(404).json({
                success:false,
                message:"Invalid Category!"
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
            category:categoryDetails._id,
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

//getAllCourses handler function
exports.showAllCourses = async (req,res) => {
    try {
        const  allCourses = await Course.find({},
                            {
                                courseName:true,
                                price:true,
                                thumbnail:true,
                                instructor:true,
                                ratingAndReviews:true,
                                studentEnrolled:true
                            })
                            .populate("instructor")
                            .exec()
        return res.status(200).json({
            success:true,
            message:"All courses fetched successfully",
            data:allCourses
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            error:error.message,
            message:"Failed to get all courses"
        })
    }
}
