const { CohereClient } = require("cohere-ai");
require("dotenv").config();

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
});

const enhanceAndSplitPromptWithCohere = async (userPrompt) => {
  try {
    const prompt = `
      You are an AI assistant that turns user prompts into cinematic video description.
  
      Task:
      - Enhance the following story idea.
      - Then split it into exactly 1 cinematic descriptions.
      - Description must be 2 paragraph only and both should be less than 900 characters.
      - Start description as normal text (no bold or formatting).
  
      User Prompt: "${userPrompt}"
    `;
  
    const response = await cohere.chat({
      model: "command-r-plus",
      message: prompt,
    });
  
    return response.text;
  } catch (error) {
    console.log(error.message || error)
  }
};

module.exports = { enhanceAndSplitPromptWithCohere };
