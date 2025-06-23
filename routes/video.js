const express = require("express");
const { generateAIVideoWithPrompt } = require("../controllers/video");
const videoRouter = express.Router();

videoRouter.post("/generate", generateAIVideoWithPrompt)

module.exports = videoRouter