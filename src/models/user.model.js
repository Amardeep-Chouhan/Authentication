import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username:
    {
        type:String,
        required:[true , "Username is required"],
        unique:[true , "Username must be unique"] 
    },
    email:
    {
            type:String,
            required:[true , "Email is required"],
            unique:[true ,"email must be unique"] 
        },
    password:{
        type:String,
        required:[true ,"password is required"],

    }

verified:{
    type:Boolean,
    default:false
}

})

const usermodel = mongoose.model("site Users", userSchema);

export default usermodel;