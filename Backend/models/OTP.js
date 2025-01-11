const mongoose = require("mongoose")
const mailSender = require("../utils/mailSender")
const emailtemplate = require("../mail/templetes/emailVerificationTemplate")
const OTPSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    otp:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        expire:5*60 // The document will be automatically deleted after 5 minutes of its creation time
    }
    

})

// a-function to send Emails

async function sendVerificationEmail(email,otp){
    
    // Create a transporter to send emails

	// Define the email options

	// Send the email
    try {
        const mailResponse = await mailSender(
            email,
            "Verification email from Study Notion",
            emailtemplate(otp))
        console.log("email send successfully",mailResponse)
    } catch (error) {
        console.log("error occured while sending email",error)
        throw error
    }
}

// Define a post-save hook to send email after the document has been saved
OTPSchema.pre("save",async function(next){
    if(this.isNew){

        await sendVerificationEmail(this.email,this.otp)
    }
    next()
})

module.exports = mongoose.model("OTP",OTPSchema)