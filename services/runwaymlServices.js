const { default: RunwayML, TaskFailedError } = require("@runwayml/sdk");
require("dotenv").config();

const client = new RunwayML({
  apiKey: process.env.RUNWAYML_API_SECRET
});

const generateVideoFromImageWithRunwayml = async (promptImages, promptText) => {
  const videos = [];

  try {
    for (const image of promptImages) {
      const task = await client.imageToVideo.create({
        model: "gen4_turbo",
        promptImage: image,
        promptText,
        ratio: "1280:720",
        duration: 5
      });

      const result = await task.waitForTaskOutput();

      const videoUrl = result.output?.[0];
      if (videoUrl) {
        console.log("Video URL:", videoUrl);
        videos.push(videoUrl);
      } else {
        console.log("No output found for this task.");
      }
    }

    return videos;

  } catch (error) {
    // if (error instanceof TaskFailedError) {
    //   console.error("Video generation task failed:", error.taskDetails);
    // } else {
    //   console.error("Error during video generation:", error);
    // }
    console.error("Error during video generation:", error);
  }
};

module.exports = { generateVideoFromImageWithRunwayml };
