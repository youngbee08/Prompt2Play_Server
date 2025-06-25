const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    fullName:{
        type:String,
        required:[true, "Name is required"],
        trim: true
    },
    userName:{
        type:String,
        required:[true, "User Name is required"],
        unique:[true, "User Name already exists"],
        trim: true
    },
    email:{
        type:String,
        required:[true, "Email is required"],
        unique:[true, "Email already exists"],
        trim: true,
        match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"]
    },
    password:{
        type:String,
        required:[true, "Password is required"],
    },
    phoneNumber:{
        type:String,
        default:null,
        unique:[true, "Phone Number already exists"]
    },
    profilePic:{
        type:String,
        default:null
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    isEmailVerified:{
        type:Boolean,
        default:false
    },
    emailVerifytoken:{
        type:String,
    },
    emailVerifytokenExp:{
        type:Date,
    },
    videos:{
        type:mongoose.Schema.Types.ObjectId, 
        ref:'videos',
        default:null
    }
});

const userModel = mongoose.model("users", userSchema);

module.exports = userModel;