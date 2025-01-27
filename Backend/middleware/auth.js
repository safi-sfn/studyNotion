const jwt = require("jsonwebtoken")
require("dotenv").config()
const User  = require("../models/User")

//auth
exports.auth = async (req,res,next) => {
    try {
        //extract Token
         const token = req.body.token || req.cookies.token ||req.header("Authorization").replace("Bearer ","")
        
         // if token missing then return response
         if(!token){
            return res.status(401).json({
                success:false,
                message:"Token not Found!"
            })
         }

         //verify the token
         try {
            const decode =  jwt.verify(token, process.env.JWT_SECRET)
            console.log(decode)
            req.user = decode
         } catch (error) {
            return res.status(401).json({
                success:false,
                message:"Invalid Token!"
            })
         }
         next()
    } catch (error) {
        return res.status(401).json({
            success:false,
            message:"Something went wrong While validating Token"
        })
    }
}



//isStudent
exports.isStudent = async (req,res,next) => {
    try {
        if(req.user.accountType !== "Student"){
            return res.status(401).json({
                success:false,
                message:"This is for Student!"
            })
        }
        next()
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"Something went wrong"
        })
    }
}

//isInstructor
exports.isInstructor = async (req,res,next) =>{
    try {
        if(req.user.accountType !== "Instructor"){
            return res.status(401).json({
                success:false,
                message:"This is for Instructor"
            })
        }
        next()
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"Something went wrong"
        })
    }
}

//isAdmin
exports.isAdmin = async (req,res,next) =>{
    try {
        console.log("printing account type:",req.user.accountType)
        if(req.user.accountType !== "Admin"){
            return res.status(401).json({
                success:false,
                message:"This is for Admin"
            })
        }
        next()
    } catch (error) {
        console.log("Backend/middleware/auth.js====>",error)
        return res.status(500).json({
            success:false,
            message:"Something Went wrong"
        })
    }
}


