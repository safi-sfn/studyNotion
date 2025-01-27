const Course = require("../models/Course")
const Category = require("../models/Category")
const User = require("../models/User")
const {uploadImageToCloudinary} = require("../utils/imageUploader")
require("dotenv").config()

//create Course Handler function
exports.createCourse = async (req,res) => {
    try {
        const userId = req.user.id
        //Data fetch
        let {
            courseName, 
            courseDescription, 
            whatYouWillLearn, 
            price, 
            category,
            tag,
            status,
            instructions,
            } = req.body

        //get thumbnail
        const thumbnail = req.files.thumbnailImage
        
        //validation
        if(!courseName || !courseDescription || !whatYouWillLearn || !price || !tag ||!category ||!thumbnail){
            return res.status(400).json({
                success:false,
                message:"All Fields are required"
            })
        }

        if(!status || status === undefined){
            status = "Draft"
        }

        //check for Instructor
        const instructorDetails = await User.findById(userId, {accountType:"Instructor"})
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
            tag:tag,
            category:categoryDetails._id,
            thumbnail:thumbnailImage.secure_url,
            status:status,
            instructions:instructions
        })

        //add the new course to the user schema of Instructor
        await User.findByIdAndUpdate(
            {_id:instructorDetails._id},
            {
                $push:{
                    course:newCourse._id
                }
            },
            {new:true}
        )

        // Add the new course to the Categories
		await Category.findByIdAndUpdate(
			{ _id: category },
			{
				$push: {
					course: newCourse._id,
				},
			},
			{ new: true }
		);

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

// get courseDetails

exports.getCourseDetails = async (req,res) => {
    try{
        const {courseId} = req.body

        //find Course details
        const courseDetails = await Course.find({  
                                    _id:courseId
                                    })
                                    .populate({
                                        path:"instructor",
                                        populate:{
                                           path:"additionalDetails"
                                        }
                                    })
                                    .populate("category")
                                    .populate("ratingAndReviews")
                                    .populate({
                                        path:"courseContent",
                                        populate:{
                                            path:"subSection"
                                        }
                                    })
                                    .exec()
        //validation
        if(!courseDetails){
            return res.status(404).json({
                success:false,
                message:"Course not found"
            })
        }

        //return response
        return res.status(200).json({
            success:true,
            message:"Course details fetched successfully",
            data:courseDetails
        })
    }catch(error){
        console.log(error)
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}