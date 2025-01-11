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


exports.showAllCategory = async (req,res) => {
    try {
        
        const allCategory = await Category.find({},{name:true,description:true})
        return res.status(200).json({
            success:true,
            message:"All category return successfully",
            data:allCategory
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

// Category page Details

exports.categoryPageDetails = async (req,res) => {
    try {
        const {categoryId} = req.body
        // Get courses for the specified category
        const selectedCategory = await Category.findById(categoryId)
                .populate("courses")
                .exec()
        console.log(selectedCategory)

        // Handle the case when the category is not found
        if(!selectedCategory){
            console.log("Category not found")
            return res.status(404).json({
                success:false,
                message:"Category not found"
            })
        }

        // Handle the Case when there are no courses
        if(selectedCategory.courses.length === 0){
            return res.status(404).json({
                success:false,
                message:"No courses found for the selected category"
            })
        } 

        const selectedCourses = selectedCategory.courses

        // get courses for other categories
        const categoriesExceptSelected = await Category.find({
            _id:{$ne:categoryId}
        }).populate("courses")
        let differentCourses = []
        for(const category of categoriesExceptSelected){
            differentCourses.push(...category.courses)
        }

        // Get top-selling courses across all categories
        const allCategories = await Category.find().populate("courses")
        const allCourses = allCategories.flatMap((category) => category.courses)
        const mostSellingCourses = allCourses.sort((a,b)=>b.sold - a.sold).slice(0,10)

        //return rseponse
        return res.status(200).json({
            success:true,
            message:"Category page details fetched successfully",
            selectedCourses:selectedCourses,
            differentCourses:differentCourses,
            mostSellingCourses:mostSellingCourses

        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Internal Server Error"

        })
    }
}
