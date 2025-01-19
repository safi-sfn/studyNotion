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
        const courseDetails = await Course.findOne({_id:courseId})
        //check if user is already reviewd course
        //create rating and review
        //update course with current rating and review
        //return response
    } catch (error) {
        
    }
}

//getAverageRating

//getAllRating