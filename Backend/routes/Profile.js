const express = require("express")
const router = express.Router()
const {auth} = require("../middleware/auth")
const {
    updateProfile,
    deleteAccount,
    getAllUserDetails,
    updateDisplayPicture,
    getEnrolledCourses
} = require("../controllers/Profile")

// ************************************************************************************
//                         Profile Routes
// ************************************************************************************
// Delete User Account
router.delete("/updateProfile",auth, updateProfile)
router.delete("/deleteProfile", deleteAccount)
router.delete("/getAllUserDetails",auth, getAllUserDetails)
router.delete("/updateDisplayPicture",auth, updateDisplayPicture)
router.delete("/getEnrolledCourses",auth, getEnrolledCourses)

module.exports = router