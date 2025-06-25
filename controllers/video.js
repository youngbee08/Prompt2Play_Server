const cloudinary = require("../config/cloudinary");
const { enhanceAndSplitPromptWithCohere } = require("../services/cohereaiservices");
const { generateVideoFromImageWithRunwayml } = require("../services/runwaymlServices");
const { generateImageFromPromptWithStability } = require("../services/stabilityaiServices");

const generateAIVideoWithPrompt = async (req, res, next) => {
  const { body } = req;
  if (!body) {
    return res.status(403).json({
      status: "error",
      message: "All fields are required"
    });
  }

  const { prompt } = body;
  try {
    /*const enhancedText = await enhanceAndSplitPromptWithCohere(prompt);

    if (!enhancedText) {
      return res.status(400).json({
        status: "error",
        message: "Unable to create video"
      });
    }

    const extractScenes = (enhancedText) => {
      const scenePattern = /Scene \d+:\s*(.+)/g;
      const scenes = [];
      let match;

      while ((match = scenePattern.exec(enhancedText)) !== null) {
        scenes.push(match[1].trim());
      }

      return scenes;
    };

    const scenes = extractScenes(enhancedText);
    const images = [];

    for (const scene of scenes) {
      const img = await generateImageFromPromptWithStability(scene);
      if (img) {
        const uploaded = await cloudinary.uploader.upload(img, {
          folder: "Prompt2Play"
        });
        images.push(uploaded.secure_url);
      }
    }

    if (!images.length) {
      return res.status(400).json({
        status: "error",
        message: "No images generated"
      });
    } */

    const images = ["https://res.cloudinary.com/dtmllxk1r/image/upload/v1750685720/Prompt2Play/wbcuidcy2ujbj4ppzhva.png","https://res.cloudinary.com/dtmllxk1r/image/upload/v1750685705/Prompt2Play/q0pgd4ivhapwn5ailsh2.png","https://res.cloudinary.com/dtmllxk1r/image/upload/v1750685643/Prompt2Play/wwnfegorlcnpjfkefyqc.png"];
    
    const videoURLS = await generateVideoFromImageWithRunwayml(images,prompt);

    if (!videoURLS) {
      return res.status(400).json({
        status: "error",
        message: "No videos generated"
      });
    }

    res.status(201).json({
      status: "success",
      message: "Video created successfully",
      videoURLS
      // scenes,
      // images
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = { generateAIVideoWithPrompt };
