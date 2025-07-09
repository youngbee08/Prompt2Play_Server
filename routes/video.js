const express = require("express");
const { generateAIVideoWithPrompt, getVideos } = require("../controllers/video");
const isLoggedIn = require("../middlewares/isLoggedIn");
const videoRouter = express.Router();

videoRouter.post("/generate", isLoggedIn, generateAIVideoWithPrompt)
videoRouter.get("/all", isLoggedIn, getVideos)

module.exports = videoRouter