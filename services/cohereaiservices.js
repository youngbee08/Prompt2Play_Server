const { CohereClient } = require("cohere-ai");
require("dotenv").config();

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
});

const enhanceAndSplitPromptWithCohere = async (userPrompt) => {
  try {
    const prompt = `
      You are an AI assistant that turns user prompts into cinematic video scenes.
  
      Task:
      - Enhance the following story idea.
      - Then split it into exactly 5 cinematic scene descriptions.
      - Each scene must be 1 sentence only.
      - Start each scene with "Scene 1:", "Scene 2:", ..., "Scene 5:" (no bold or formatting).
  
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
