const RunwayML = require("@runwayml/sdk");
require("dotenv").config();

const client = new RunwayML({ apiKey: process.env.RUNWAYML_API_SECRET });

const generateVideoFromImageWithRunwayml = async (promptImage, promptText) => {
  try {
    const taskPromise = client.imageToVideo.create({
      model: "gen4_turbo",
      promptImage,
      promptText,
      ratio: "1280:720",
      duration: 10,
    });

    const result = await taskPromise.waitForTaskOutput();

    const videoUrl = result.output?.[0];
    if (videoUrl) {
      console.log("✅ Video URL:", videoUrl);
      return videoUrl;
    } else {
      console.warn("⚠️ No video generated.");
      return null;
    }

  } catch (error) {
    console.error("❌ Error during video generation:", error);
    return null;
  }
};

module.exports = { generateVideoFromImageWithRunwayml };
