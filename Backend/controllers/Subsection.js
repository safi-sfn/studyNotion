const SubSection = require("../models/SubSection")
const Section = require("../models/Section")
const { uploadImageToCloudinary } = require("../utils/imageUploader")
require("dotenv").config()

//create subSection

exports.createSubSection = async (req,res) => {
    try {
        //data fetch from req body
        const {sectionId,title,description,timeDuration} = req.body

        //extract file/video
        const video = req.files.videoFile

        //data validation 
        if(!sectionId || !title || !description || !timeDuration ||!video){
            return res.status(400).json({
                sucess:false,
                message:"All fields are required"
            })
        }

        //upload video to cloudinary
        const uploadDetails = await uploadImageToCloudinary(video,process.env.FOLDER_NAME)

        //create a sub section
        const subSectionDetails = await SubSection.create({
            title:title,
            description:description,
            timeDuration:timeDuration,
            video:uploadDetails.secure_url,
        })

        //update section with this Sub section objectId
        const updatedSection = await Section.findByIdAndUpdate(
                                {id:sectionId},
                                {$push:{
                                    subSection:subSectionDetails._id
                                }},
                                {new:true}
                     ).populate("subSection")
        //TODO: log updated section here, after adding populate query
        //return respnse 
        return res.status(200).json({
            sucess:true,
            message:"Sub section created successfully",
            data: updatedSection
        })
    } catch (error) {
        return res.status(500).json({
            sucess:false,
            message:"Internal server error",
            error:error.message
        })
    }
}

//TODO: update subSection
//TODO: delete subSection