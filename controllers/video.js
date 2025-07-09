const cloudinary = require("../config/cloudinary");
const userModel = require("../models/auth");
const videoModel = require("../models/video");
const { enhanceAndSplitPromptWithCohere } = require("../services/cohereaiservices");
const { generateVideoFromImageWithRunwayml } = require("../services/runwaymlServices");
const { generateImageFromPromptWithStability } = require("../services/stabilityaiServices");

const generateAIVideoWithPrompt = async (req, res, next) => {
  const { body } = req;
  console.log(req.body)
  if (!body) {
    return res.status(403).json({
      status: "error",
      message: "All fields are required"
    });
  }

  const { prompt } = body;
  const user = req.user;
  try {
    const enhancedPrompt = await enhanceAndSplitPromptWithCohere(prompt);
    let imageUrl;

    if (!enhancedPrompt) {
      return res.status(400).json({
        status: "error",
        message: "An error occured while generating your video, Please try again!",
        errorFrom:"Cohere(text)"
      });
    }
    console.log(enhancedPrompt);

   const img = await generateImageFromPromptWithStability(enhancedPrompt);
   if (img) {
     const uploaded = await cloudinary.uploader.upload(img, {
       folder: "Prompt2Play"
     });
     imageUrl = uploaded.secure_url;
     console.log(imageUrl)
   }else{
    return res.status(200).json({
      status:"error",
      message: "An error occured while generating your video, Please try again!",
      errorFrom:"Stability(img)"
    })
   }

    
    const videoURL = await generateVideoFromImageWithRunwayml(imageUrl,enhancedPrompt);
    console.log(videoURL)

    if (!videoURL) {
      return res.status(400).json({
        status: "error",
        message: "An error occured while generating your video, Please try again!",
        errorFrom:"runway(video)"
      });
    }

    const video = await videoModel.create({...body,createdBy:user._id,videoUrl:videoURL});

    if (!video) {
      return res.status(400).json({
        status: "error",
        message: "An error occured while generating your video, Please try again!",
      });
    }

    await userModel.findByIdAndUpdate(user._id, {$push:{videos:video._id}})

    res.status(201).json({
      status: "success",
      message: "Video created successfully",
      video:videoURL
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const getVideos = async (req,res,next)=>{
  const user = req.user;
  try {
    const findUserVideos = await userModel.findById(user._id).populate("videos");
    if (!findUserVideos) {
      return res.status(400).json({
        status:"success",
        message:"Unable to find videos"
      });
    }
    const videos = findUserVideos.videos;
    res.status(200).json({
      status:200,
      videos
    })
  } catch (error) {
    console.log(error)
    next(error)
  }
};

module.exports = { generateAIVideoWithPrompt,getVideos };
