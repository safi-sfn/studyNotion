const  Category = require("../models/Category") 

//create Category handler function

exports.createCategory = async (req,res) => {
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
        const categoryDetails = await Category.create({
            name:name,
            description:description
        })
        consolr.log(categoryDetails)

        //return response
        return res.status(200).json({
            success:true,
            message:"Category created Successfully"
        })


    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}


// getAllCategory handler Function

exports.showAllCategory = async (req,res) => {
    try {
        
        const allCategory = await Category.find({},{name:true,description:true})
        return res.status(200).json({
            success:true,
            message:"All category return successfully",
            allCategory
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

