
import userModel from "../models/User.model.js";
import { sendMail } from "../services/mail.service.js";
import jwt from "jsonwebtoken";

export async function register(req,res){
    const {username,email,password} = req.body;
    const isUserByEmail=await userModel.findOne({
        $or:[
            {email},
            {username}
        ]
    });
    if(isUserByEmail){
        return res.status(400).json({
            success:false,
            message:"User already exists"
        });
    }
    
    const user=await userModel.create({
        username,
        email,
        password
    })

    const emailVerficationToken=jwt.sign({
        email: user.email
    },process.env.JWT_SECRET)


    await sendMail({
        
        to:user.email,
        subject:"Welcome to perplexity",
        
        html:`
        <h1>Hi ${user.username}</h1>
        <p>Welcome to perplexity</p>
        <a href="http://localhost:3000/api/auth/verify-email?token=${emailVerficationToken}">Click here to verify your email</a>
        <p>Thanks for registering with us</p>
        <p> Best Regards</p><p>Perplexity Team</p>
        `
    })
    

    res.status(201).json({
        message:"User register succesfull",
        success:true,
        user:{

            id:user._id,
            username:user.username,
            email:user.email
        }

    })

   
}


export async function emailVerify(req,res){
  const {token}= req.query;

  try{
      const decoded=jwt.verify(token,process.env.JWT_SECRET);
 
   const user=await userModel.findOne({
    email:decoded.email
   })
   if(!user){
    return res.status(400).json({
      message:'Invalid token',
      success:false,
      err:'User not found'
    })
   }
   user.verified=true;
   await user.save();
   const html=`
    <h1>Email verified successfully</h1>
    <p>Your email has been successfully verified. You can now log in to your account and start using our services.</p>
    <a href="http://localhost:3000/login">Go to Login</a>
   
   `
   res.send(html)

  }catch(err){
    return res.status(400).json({
      message:"Invalid expired token",
      success:false,
      err:'Invalid token'

    })
  }

  

}
export async function login(req,res){
    const {email,password}=req.body;
    const user=await userModel.findOne({
        email
    })
    if(!user){
        return res.status(400).json({
            success:false,
            message:"User not found"
        })
    }
    const isPasswordValid=await user.comparePassword(password);
    if(!isPasswordValid){
        return res.status(400).json({
            success:false,
            message:"Invalid password"
        })
    }
    if(!user.verified){
        return res.status(400).json({
            success:false,
            message:"Please verify your email",
            err:"User not verified"
        })
    }
    const token=jwt.sign({
        id:user._id,
        username:user.username,

    },process.env.JWT_SECRET,{
        expiresIn:"7d"
    })
    
    res.cookie("token",token)
    res.status(200).json({
        success:true,
        message:"Login successfull",
        user:{
            id:user._id,
            username:user.username,
            email:user.email
        }
    })
}

export async function getMe(req,res){
    const userId=req.user.id;
    const user=await userModel.findById(userId).select("-password");
   if(!user){
    return res.status(400).json({
        success:false,
        message:"User not found"
    })
   }
   res.status(200).json({
    success:true,
    user
   })

}