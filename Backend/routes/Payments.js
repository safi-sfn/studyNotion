// Import the Required modules
const express = require("express")
const router = express.Router()

const {capturepayments,verifySignature} = require("../controllers/Payments")
const {auth, isInstructor, isStudent, isAdmin} = require("../middleware/auth")

router.post("/capturePayment", auth, isStudent, capturepayments)
router.post("/verifySignature", verifySignature)

module.exports = router