import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
    {
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"site Users",
        required:[true,"user Id is required"],
    },
    refreshTokenHash:{
        type:"String",
        required:[true,"refreshToken is required"]

    },
    ip:{
        type:"String",
        required:[true,"IP is required"]
    },
    userAgent:{
        type:"String",
        required:[true,"userAgent is required"]
    },
    revoked:{
        type:"Boolean",
        default:false
    },
},
{
  timestamps:true
}
) 
 
const sessionModel = mongoose.model("sessions", sessionSchema);

export default sessionModel;