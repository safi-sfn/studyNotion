const RatingAndReview = require("../models/RatingAndReview")
const Course = require("../models/Course")

//createRating
exports.createRating = async (req,res) => {
    try {
        
        //get user id
        const userId = req.user.id
        //fetchdata from req.body
        const {rating,review,courseId} = req.body

        //check if user is enrolled or not
        const courseDetails = await Course.findOne(
                                {_id:courseId,
                                    studentsEnrolled:{$elemMatch:{$eq:userId}}
                                })
        if(!courseDetails){
            return res.status(404).json({
                success:false,
                message:"students is not enrolled in the course"
            })
        }
        //check if user is already reviewd course
        const alreadyReviewed = await RatingAndReview.findOne({
                                    user:userId,
                                    course:courseId
                                })
        if(alreadyReviewed){
            return res.status(403).json({
                success:false,
                message:"you already reviewed this course"
            })
        }
        //create rating and review
        const ratingReview = await RatingAndReview.create({
                                            rating, 
                                            review,
                                            course:courseId,
                                            user:userId       
                                         })
        //update course with current rating and review
        await Course.findByIdAndUpdate({_id:courseId},
                                        {
                                            $push:{
                                                ratingAndReviews:ratingReview._id
                                            }
                                        },
                                       {new:true})
        //return response
        return res.status(200).json({
            success:true,
            message:"rating and review created successfully",
            ratingReview
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

//getAverageRating
exports.getAverageRating = async (req,res) => {
    try {
        //get course id from request
        const courseId = req.body.courseid

        //calculate average rating
        const result = await RatingAndReview.aggregate([
                                    {
                                        $match:{
                                            course:new mongoose.Types.ObjectId(courseId)
                                        }
                                    },
                                    {
                                        $group:{
                                            _id:null,
                                            averageRating:{$avg:"$rating"}
                                        }
                                    }
                                ])
        //return response
        if(result.length > 0){
            return res.status(200).json({
                success:true,
                message:"average rating retrieved successfully",
                averageRating : result[0].averageRating
            })
        }
        // if no rating review exist
        return res.status(200).json({
            success:true,
            message:"No rating exist",
            averageRating : 0
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

//getAllRatingAndReviews
exports.getAllRating = async (req,res) => {
    try {
        const allReviews = await RatingAndReview.find({})
                                    .sort({rating:"desc"})
                                    .populate({
                                        path:"user",
                                        select:"firstName, lastName, email, image"
                                    })
                                    .populate({
                                        path:"course",
                                        select:"courseName"
                                    })
                                    .exec()
        //return response
        return res.status(200).json({
            success:true,
            message:"All review fetched successfully",
            data:allReviews,
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}