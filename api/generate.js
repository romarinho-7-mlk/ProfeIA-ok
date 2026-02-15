import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY || "";
const ai = new GoogleGenAI({ apiKey });
const DEFAULT_MODEL = "gemini-2.0-flash";

export default async function handler(req, res) {
    // Only allow POST
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    if (!apiKey) {
        return res
            .status(500)
            .json({ error: "GEMINI_API_KEY não configurada no servidor." });
    }

    try {
        const { contents, config } = req.body;

        if (!contents) {
            return res.status(400).json({ error: "Campo 'contents' é obrigatório." });
        }

        const response = await ai.models.generateContent({
            model: DEFAULT_MODEL,
            contents,
            config: config || {},
        });

        const text = response.text || "";

        // Check for inline image data
        let images = [];
        if (response.candidates?.[0]?.content?.parts) {
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData) {
                    images.push({
                        mimeType: part.inlineData.mimeType || "image/png",
                        data: part.inlineData.data,
                    });
                }
            }
        }

        return res.status(200).json({ text, images });
    } catch (error) {
        console.error("Erro na API Gemini:", error);
        return res.status(500).json({
            error: error.message || "Erro desconhecido na API Gemini",
        });
    }
}
