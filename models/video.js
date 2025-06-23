const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({
    prompt:{
        type:String,
        required:[true, "Prompt is required"]
    },
    videoUrl:{
        type:String,
        default:null
    },
    videoCreationTime:{
        type:Date,
        default:Date.now
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users"
    }
});

const videoModel = mongoose.model("videos", videoSchema);

module.exports = videoModel;