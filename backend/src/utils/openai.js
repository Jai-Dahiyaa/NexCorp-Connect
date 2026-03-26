import client from "../config/openai.js"
import logger from "../config/logger.js";

async function runLLM() {
    const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: "Hello LLM from config!" }]
    })
    logger.info(response.choices[0].message.content)
}

export default runLLM;