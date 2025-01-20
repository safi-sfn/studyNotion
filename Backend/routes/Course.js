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
