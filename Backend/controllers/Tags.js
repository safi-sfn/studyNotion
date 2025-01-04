const  Tag = require("../models/Tags") 

//create tag handler function

exports.createTag = async (req,res) => {
    try {
        //data fetch
        const {name,description} = req.body

        //validation
        if(!name || !description){
            return res.status(400).json({
                success:false,
                message:"All fields are require"
            })
        }

        //create entry in DB
        const tagDetails = await Tag.create({
            name:name,
            description:description
        })
        consolr.log(tagDetails)

        //return response
        return res.status(200).json({
            success:true,
            message:"Tags created Successfully"
        })


    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}


// getAlltags handler Function

exports.showAllTags = async (req,res) => {
    try {
        
        const allTags = await Tag.find({},{name:true,description:true})
        return res.status(200).json({
            success:true,
            message:"All tag return successfully",
            allTags
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

