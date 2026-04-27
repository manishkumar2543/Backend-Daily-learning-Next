import dotenv from "dotenv"

dotenv.config()
import nodemailer from "nodemailer"

const transporter=nodemailer.createTransport({
    service:'gmail',
    auth: {
    type: 'OAuth2',
    user: process.env.GOOGLE_USER,
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_SECRET_ID,
    refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
  },
})
transporter.verify()
.then(()=>{
    console.log('transporter ready to send email')
})
.catch((err)=>{
    console.log("Error transporter virification failed",err)
})
export async function sendMail({to,subject,text,html}){
    const mailOption={
        from:process.env.GOOGLE_USER,
        to,
        subject,
        text,
        html
    
}
    const details=await transporter.sendMail(mailOption)
    console.log('Email sent',details)
}


