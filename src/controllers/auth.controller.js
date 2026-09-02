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

// login - login 

export const login = async (req, res) => {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email })

    if (!user) {
        return res.status(401).json({
            message: "Invalid email or password"
        })
    }

    if (!user.verified) {
        return res.status(401).json({
            message: "Email not verified"
        })
    }

    const hashedPassword = crypto.createHash("sha256").update(password).digest("hex");

    const isPasswordValid = hashedPassword === user.password;

    if (!isPasswordValid) {
        return res.status(401).json({
            message: "Invalid email or password"
        })
    }

    const refreshToken = jwt.sign({
        id: user._id
    }, config.JWT_SECRET,
        {
            expiresIn: "7d"
        }
    )

    const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");

    const session = await sessionModel.create({
        user: user._id,
        refreshTokenHash,
        ip: req.ip,
        userAgent: req.headers[ "user-agent" ]
    })

    const accessToken = jwt.sign({
        id: user._id,
        sessionId: session._id
    }, config.JWT_SECRET,
        {
            expiresIn: "15m"
        }
    )

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    })

    res.status(200).json({
        message: "Logged in successfully",
        user: {
            username: user.username,
            email: user.email,
        },
        accessToken,
    })
}

// Get-me -- details of user

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

// logutall

export const logoutall = async(res,req)=> {

  const refreshToken = req.coojies.refreshToken;

if (!refreshToken) {
        return res.status(400).json({
            message: "Refresh token not found"
        })
    }
 
   const decoded = jwt.verify(refreshToken, config.JWT_SECRET);

    await sessionModel.updateMany({
        user: decoded.id,
        revoked: false
    }, {
        revoked: true
    })
res.clearCookie("refreshToken");

    res.status(200).json({
        message: "Logged out from all devices successfully"
    })



}