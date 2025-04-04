const nodemailer = require('nodemailer');
require('dotenv').config();
const mailSender = async(email, title, body)=>{
    try{
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            auth:{ 
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            } 
        })

        // console.log(transporter)

        let info = await transporter.sendMail({
            from: "Divyansh Gupta - Test Mail",
            to: `${email}`,
            subject: `${title}`,
            html: `${body}`,
        })

        // console.log(info);
        return info;
    }catch(error){
        console.log(error.message);
        return res.status(400).json({
            success: false,
            message: "can't send email",
        })
    }
}

module.exports = mailSender;