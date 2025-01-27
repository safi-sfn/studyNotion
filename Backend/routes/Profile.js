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

router.put("/updateProfile",auth, updateProfile)
router.delete("/deleteProfile",auth, deleteAccount)
router.get("/getAllUserDetails",auth, getAllUserDetails)
router.put("/updateDisplayPicture",auth, updateDisplayPicture)
router.get("/getEnrolledCourses",auth, getEnrolledCourses)

module.exports = router