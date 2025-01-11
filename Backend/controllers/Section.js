const Section = require("../models/Section")
const Course = require("../models/Course")

//create Section handler
exports.createSection = async (req,res) =>{
    try {

        //data fetch
        const {sectionName,courseId} = req.body

        //data validation
        if(!sectionName || !courseId){
            return res.status(400).json({
                success:false,
                message:"Please fill all the fields"
            })
        }
        
        //create new Section
        const newSection = await Section.create({sectionName})

        //update course with new section ObjectID
        const updatedCourseDetails = await Course.findByIdAndUpdate(
                                        courseId,
                                        {
                                            $push:{
                                                courseContent:newSection._id
                                            }
                                        },
                                        {new:true}
                                   )
                                   .populate({
                                    path:"courseContent",
                                    populate:{
                                        path:"subSection"
                                    }
                                   }) 
                                   .exec()
        //HW:use populate to replace Section/sub-section both in the updatedCourseDetails
        //return response
        return res.status(200).json({
            success:true,
            message:"Section created successfully",
            updatedCourseDetails
        })

    } catch (error) {
        return res.staus(500).json({
            success:false,
            message:"Unable to create Section",
            error:error.message
        })
    }
}


//update Section handler

exports.updateSection = async (req,res) => {
    try {
        //data fetch
        const {sectionName,sectionId} = req.body

        //data validation
        if(!sectionName || !sectionId){
            return res.status(400).json({
                success:false,
                message:"Please fill all the fields"
            })
        }

        //update data
        const sectionUpdate = await Section.findOneAndUpdate(sectionId, {sectionName}, {new:true})

        //return res
        return res.status(200).json({
            success:true,
            message:"Section updated successfully",
            data: sectionUpdate
        })
        
    } catch (error) {
        return res.staus(500).json({
            success:false,
            message:"Unable to create Section",
            error:error.message
        })
    }
}


//delete section handler
exports.deleteSection = async (req,res) => {
    try {
        //get Id
        const {sectionId} = req.params

        //use findByIdandDelete
         await Section.findByIdAndDelete(sectionId)
         //TODO[testing]:do we need to delete the entry from the course schema

        //return response
        return res.status(200).json({
            success:true,
            message:"Section deleted successfully"
        })
    } catch (error) {
        return res.staus(500).json({
            success:false,
            message:"Unable to create Section",
            error:error.message
        })
    }
}