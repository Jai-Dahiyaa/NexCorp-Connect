import client from "../../config/openai.js";
import AppError from "../../utils/appError.js";

export const openAIController = async (req, res) => {
    const { question } = req.body;

    if (!question) throw new AppError("Please ask any thik", 400);

    const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {role: "system", content: "Your name is 'Jai Assistant'. You are guide me every time and help me my project ok and you behave like you are my junior developer and your name is jai"},
        { role: "user", content: question }
    ]
    })

    if (!response) throw new AppError("Response not create please try again", 404)

    res.status(200).json({ status: true, answer: response })
}