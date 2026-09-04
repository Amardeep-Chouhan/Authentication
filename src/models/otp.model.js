import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [ true, "Email is required" ]
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "site users",
        required: [ true, "User is required" ]
    },
    otpHash: {
        type: String,
        required: [ true, "OTP hash is required" ]
    },
    expiresAt: {
        type: Date,
        required: true,
        index: { expires: 0 }
    }

}, {
    timestamps: true
})

const otpModel = mongoose.model("otps", otpSchema)

export default otpModel;