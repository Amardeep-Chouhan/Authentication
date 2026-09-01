import usermodel from "../models/user.model.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import {ENV} from "../lib/env.js"
import sessionModel from "../models/session.model.js";

export const registerUser = async(req,res)=>{
      const {username,email,password}=req.body;

      const isAlreadyRegistered = await usermodel.findOne({$or:[ {username},{email}]});

      if(isAlreadyRegistered){
            return res.status(409).json({message:"User already registered"});
      }

      const hashedPassword = crypto.createHash("sha256").update(password).digest("hex");

      const newUser = await usermodel.create({
        username,
        email,
        password:hashedPassword
      });


      const refreshToken = jwt.sign({id:newUser._id},ENV.JWT_SECRET,{expiresIn:"7d"});

      const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");

      const session = await sessionModel.create({
        userId:newUser.id,
        refreshTokenHash,
        ip:req.ip,
        userAgent:req.headers["user-agent"]
      })



    const accessToken = jwt.sign(
      {id:newUser._id,
        sessionId:session._id
      },
      ENV.JWT_SECRET,
      {expiresIn:"15m"});

    

   res.cookie("refreshToken",refreshToken,{
    httpOnly:true,
    secure:true,
    sameSite:"strict",
    maxAge:7*24*60*60*1000 
   })


    res.status(201).json({message:"User created Sucessfully",user:{username:newUser.username,email:newUser.email},accessToken
    }
    )
}


// Get-me

export const getMe = async(req,res)=>{
  const token = req.headers.authorization?.split(" ")[1];

  if(!token)
  {
    return res.status(401).json({message:"token not found"})
  }

  const decoded =jwt.verify(token , ENV.JWT_SECRET);
  
  const user = await usermodel.findById(decoded.id).select("-password")

  res.status(200).json({message:"user fetched sucessfully",user:{username:user.username,email:user.email}})


}


// rotation -token creation


export const refreshToken = async(req,res)=> {

  const refreshToken = req.cookies.refreshToken;

  if(!refreshToken){
    return res.status(401).json({message:"refresh token not found"})
  }

  const decoded = jwt.verify(refreshToken, ENV.JWT_SECRET);

  const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");

   const session = await sessionModel.findOne({
        refreshTokenHash,
        revoked: false
    })

    if (!session) {
        return res.status(401).json({
            message: "Invalid refresh token"
        })
    }

  const accessToken = jwt.sign(
    {id:decoded.id},
    ENV.JWT_SECRET,
    {expiresIn:"15m"});

  const newRefreshToken = jwt.sign(
    {id:decoded.id},
    ENV.JWT_SECRET,
    {expiresIn:"7d"});

    const newRefreshTokenHash = crypto.createHash("sha256").update(newRefreshToken).digest("hex");

    session.refreshTokenHash = newRefreshTokenHash;
    await session.save();

  res.cookie("refreshToken", newRefreshToken,{
    httpOnly:true,
    secure:true,
    sameSite:"strict",
    maxAge:7*24*60*60*1000
  });

  res.status(200).json({message:"Access token refreshed sucessfully",accessToken});

}

 export const logout = async(req,res)=>{ 

  const refreshToken = req.cookies.refreshToken;

  if(!refreshToken){
    return res.status(400).json({message:"refresh token not found"})
  }

  const refreshTokenHash = crypto.createHash("sha256").update(refreshtoken).digest("hex");


  const session = await sessionModel.findOne({
    refreshTokenHash,
    revoked:false

  })

  if(!session){
    return res.status(400).json({message:"Invalid Refresh Token"})
  }
   session.revoked = true;
  await session.save();

  res.clearcookie("refreshToken");
 
 res.status(200).json({
        message: "Logged out successfully"
    })

  

}
