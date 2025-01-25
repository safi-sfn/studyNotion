const nodemailer = require("nodemailer")
require("dotenv").config()
const mailSender = async (email,title,body) =>{
    try {
        let transporter = nodemailer.createTransport({
            host:process.env.MAIL_HOST,
            auth:{
                user:process.env.MAIL_USER,
                pass:process.env.MAIL_PASS
            }
        })

        let info = await transporter.sendMail({
            from:process.env.MAIL_USER,
            to:`${email}`,
            subject:`${title}`,
            html:`${body}`
        })
        cconsole.log("mail sender information:",info)
        return info
        
    } catch (error) {
        console.log("utils/mailSender.js ==>",error.message)
    }
}

module.exports = mailSender