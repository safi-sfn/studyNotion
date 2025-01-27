const SubSection = require("../models/SubSection")
const Section = require("../models/Section")
const { uploadImageToCloudinary } = require("../utils/imageUploader")
require("dotenv").config()

//create subSection

exports.createSubSection = async (req,res) => {
    try {
        //data fetch from req body
        const {sectionId,title,description,timeDuration} = req.body


         // Check for video file
         if (!req.files || !req.files.video) {
            return res.status(400).json({
                success: false,
                message: "Video file is required",
            });
        }
        //extract file/video
        const video = req.files.video

           // Validate video format
           const supportedFormats = ["video/mp4", "video/mov"];
           if (!supportedFormats.includes(video.mimetype)) {
               return res.status(400).json({
                   success: false,
                   message: "Unsupported video format. Please upload an MP4 or MOV file.",
               });
           }
   
           // Log the video details
           console.log("Video file details:", video);
        //data validation 
        if(!sectionId || !title || !description || !timeDuration ||!video){
            return res.status(400).json({
                sucess:false,
                message:"All fields are required"
            })
        }

        //upload video to cloudinary
        const uploadDetails = await uploadImageToCloudinary(video,process.env.FOLDER_NAME)
        console.log("upload Details ==>",uploadDetails)
        //create a sub section
        const subSectionDetails = await SubSection.create({
            title:title,
            description:description,
            timeDuration:`${uploadDetails.duration}`,
            videoUrl:uploadDetails.secure_url,
        })

        //update section with this Sub section objectId
        const updatedSection = await Section.findByIdAndUpdate(
                                {_id:sectionId},
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
        console.log("Backend/controllers/Subsection.js======>",error)
        return res.status(500).json({
            sucess:false,
            message:"Internal server error",
            error:error.message
        })
    }
}

//: update subSection
exports.updateSubSection = async (req,res) => {
    try {
        //data fetch
        const {sectionId, title, description} = req.body
        const subSection = await subSection.findById(sectionId)

        //validation
        if(!subSection){
            return res.status(404).json({
                sucess:false,
                message:"Sub-section not found",
            })
        }

        if (title !== undefined) {
            subSection.title = title
        }

        if(description !== undefined) {
            subSection.description = description
        }
        if(req.files && req.files.video !== undefined) {
            const video = req.files.video
            const uploadDetails = await uploadImageToCloudinary(
                video,
                process.env.FOLDER_NAME
            )
            subSection.videoUrl = uploadDetails.secure_url
            subSection.timeDuration = `${uploadDetails.duration}`
        }

        await subSection.save()

        return res.status(200).json({
            sucess:true,
            message:"Sub-section updated successfully",
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            success:false,
            message:"An error occured while updateing the section"
        })
    }
}

//: delete subSection
exports.deleteSubSection = async (req,res) => {
    try{
        const {subSectionId, sectionId} = req.body
        await Section.findByIdAndUpdate(
            {_id:sectionId},
            {
                $pull: {
                    subSection:subSectionId
                }
            }
        )
        const subSection = await SubSection.findByIdAndDelete({_id:subSectionId})

        if(!subSection){
            return res.status(404).json({
                success:false,
                message:"Sub-section not found"
            })
        }

        return res.status(200).json({
            success:true,
            message:"sub-section deleted successfully"
        })
    }catch(error){
        console.error(error)
        return res.status(500).json({
            success:false,
            message:"An error occured while deleting the sub-section"
        })
    }
}