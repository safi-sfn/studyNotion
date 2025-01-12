const {instance} = require("../config/razorpay")
const Course = require("../models/Course")
const User = require("../models/User")
const mailSender = require("../utils/mailSender")
const {courseEnrollmentEmail} = require("../mail/templetes/courseEnrollmentEmail")
const { default: mongoose } = require("mongoose");

//capture the payment and initiate the Razorpay order
exports.capturepayments = async (req,res) => {
  // get courseId abd UserId
  const {course_id} = req.body
  const userId = req.user.id
  // validation
  // valid courseId
  if(!course_id){
    return res.status(400).json({
        success:false,
        message:"Course Id is required"
    })
  }
  // valid coursedetails
  let course
  try {
    course  = await Course.findById(course_id)
    if(!course){
        return res.status(400).json({
            success:false,
            message:"Course not found"
        })
    }
    // user already pay for the same course
    const uid = new mongoose.Types.ObjectId(userId)
    if(course.studentsEnrolled.includes(uid)){
        return res.status(200).json({
            success:true,
            message:"You already enrolled for this course"
        })
    }
  } catch (error) {
    return res.status(500).json({
        success:false,
        message:"Internal Server Error"     
    })
  }
  // order create
  const amount = course.price
  const currency = "INR"

  const options = {
    amount : amount * 100,
    currency,
    receipt: Math.random(Date.now()).toString(),
    notes:{
        "course_id":course_id,
        userId
    }
  }

  try {
    
      //initiate the payment using razorpay
      const paymentResponse = await instance.orders.create(options)
      console.log(paymentResponse)
      // return response
      return res.status(200).json({
        success:true,
        courseName:course.courseName,
        courseDescription:course.courseDescription,
        thumbnail: course.thumbnail,
        orderId: paymentResponse.id,
        currency:paymentResponse.currency,
        amount:paymentResponse.amount,

      })
  } catch (error) {
    res.status(400).json({
        success:false,
        message:"Internal Server Error"
    })
  }
}
