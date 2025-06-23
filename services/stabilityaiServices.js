const axios = require('axios');

const generateImageFromPromptWithStability = async (prompt) => {
  try {
    const payLoad = {
      text_prompts: [{ text: prompt }],
      cfg_scale: 7,
      height: 1024,
      width: 1024,
      steps: 30,
    };
    const headers = {
      headers: {
        Authorization :`Bearer ${process.env.STABILITY_API_KEY}`,
        'Content-Type': 'application/json',
        Accept:'application/json',
      },
    }
    const response = await axios.post(
      'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image',
      payLoad,headers
    );

    const base64Image = response.data.artifacts[0].base64;
    return `data:image/png;base64,${base64Image}`;
  } catch (error) {
    console.error("Image generation failed:", error?.response?.data || error.message);
    return null;
  }
};

module.exports = { generateImageFromPromptWithStability };
