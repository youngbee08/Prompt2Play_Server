const nodemailer = require("nodemailer");
const dotEnv = require("dotenv");
dotEnv.config()
const transporter = nodemailer.createTransport({
    host:'smtp.gmail.com',
    service:'gmail',
    secure:false,
    port:587,
    auth: {
        user: process.env.nodemailer_email,
        pass: process.env.nodemailer_password
    }
});

transporter.verify((err,success)=>{
    if (success) {
        console.log("Email ready to be send")
    }else{
        console.log("Error", err)
    }
})

module.exports = transporter