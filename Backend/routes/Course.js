// Import the required modules
const express = require("express")
const router = express.Router()

// Import the Controllers

// Course controllers Import
const {
    createCourse,
    showAllCourses,
    getCourseDetails
} = require("../controllers/Course")

// Categories Controllers Import
const {
    createCategory,
    showAllCategory,
    categoryPageDetails
} = require("../controllers/Categories")

// Sections Controllers Import
const {
    createSection,
    updateSection,
    deleteSection
} = require("../controllers/Section")

// Sub-Section Controllers Import
const {
    createSubSection,
    updateSubSection,
    deleteSubSection
} = require("../controllers/Subsection")

// Rating Controllers import
const {
    createRating,
    getAverageRating,
    getAllRating
} = require("../controllers/RatingAndReview")

// Importing Middlewares
const { auth, isInstructor, isStudent, isAdmin } = require("../middleware/auth")


// ********************************************************************************************************
//                                      Course routes
// ********************************************************************************************************


// Course can Only be Created by Instructor
router.post("/createCourse", auth, isInstructor, createCourse)
// Add a section to a course
router.post("/addSection", auth, isInstructor, createSection)
// update a section
router.post("/updateSection", auth, isInstructor, updateSection)
// Delete Section
router.post("/deleteSection", auth, isInstructor, deleteSection)
// Edit Sub-Section
router.post("/updateSubSection", auth, isInstructor, updateSubSection)
// Delete Sub-Section
router.post("/deleteSubSection", auth, isInstructor, deleteSubSection)
// Add a Sub-Section to Section
router.post("/addSubSection", auth, isInstructor, createSubSection)
// Get all Registered Courses
router.get("/showAllCourses", showAllCourses)
// Get Course Details
router.post("/getCourseDetails", getCourseDetails)


// ************************************************************************************************
//                                      Category routes (Only by Admin)
// ************************************************************************************************
// Category can Only Created by Admin
// TODO: Put isAdmin Middlewate here

router.post("/createCategory",auth, isAdmin, createCategory)
router.get("/showAllCategory", showAllCategory)
router.post("/categoryPageDetails", categoryPageDetails)


// ************************************************************************************************
//                                  Rating And Review
// ************************************************************************************************

router.post("/createRating", auth, isStudent, createRating)
router.get("/getAverageRating", getAverageRating)
router.get("/getReviews",getAllRating)


module.exports = router