const jwt = require("jsonwebtoken")
require("dotenv").config()
const User  = require("../models/user")

//auth
exports.auth = async (req,res,next) => {
    try {
        //extract Token
         const token = req.body.token || req.cookie.token ||req.header("Authorization").replace("Bearer ","")
        
         // if token missing then return response
         if(!token){
            return res.status(401).json({
                success:false,
                message:"Token not Found!"
            })
         }

         //verify the token
         try {
            const decode = await jwt.verify(token, process.env.JWT_SECRET)
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

//isInstructor

//isAdmin


