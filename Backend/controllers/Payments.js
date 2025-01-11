const {instance} = require("../config/razorpay")
const Course = require("../models/Course")
const User = require("../models/User")
const mailSender = require("../utils/mailSender")
const {courseEnrollmentEmail} = require("../mail/templetes/courseEnrollmentEmail")

//capture the payment and initiate the Razorpay order
exports.capturepayments = async (req,res) => {
  // get courseId abd UserId
  // validation
  // valid courseId
  // valid coursedetails
  // user already pay for the same course
  // order create
  // return response
}
