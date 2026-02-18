import { GoogleGenAI } from "@google/genai";

const geminiKey = process.env.GEMINI_API_KEY || "";
const groqKey = process.env.GROQ_API_KEY || "";
const DEFAULT_MODEL = "gemini-2.0-flash";
const GROQ_MODEL = "llama-3.3-70b-versatile";

export default async function handler(req, res) {
    // Only allow POST
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const { contents, config, provider } = req.body;

        // Auto-detect provider: If Groq key is present but Gemini is not, use Groq
        const effectiveProvider = provider || (groqKey && !geminiKey ? "groq" : "gemini");

        console.log(`[API] Provider: ${effectiveProvider} (requested: ${provider || 'none'}) | Gemini Key: ${!!geminiKey} | Groq Key: ${!!groqKey}`);

        if (!contents) {
            return res.status(400).json({ error: "Campo 'contents' é obrigatório." });
        }

        // Handle Groq Provider
        if (effectiveProvider === "groq") {
            if (!groqKey) {
                return res.status(500).json({ error: "GROQ_API_KEY não configurada na Vercel." });
            }

            let prompt = "";
            if (typeof contents === "string") {
                prompt = contents;
            } else if (contents.parts) {
                prompt = contents.parts.map(p => p.text).filter(Boolean).join("\n");
            } else if (Array.isArray(contents)) {
                prompt = JSON.stringify(contents);
            }

            if (!prompt) {
                throw new Error("O conteúdo enviado é incompatível com o Groq (PDFs e Imagens requerem o Gemini).");
            }

            const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${groqKey}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: GROQ_MODEL,
                    messages: [{ role: "user", content: prompt }],
                    temperature: config?.temperature || 0.7,
                    max_tokens: 4000
                })
            });

            const data = await response.json();

            if (!response.ok) {
                console.error("Erro detalhado Groq:", data);
                throw new Error(data.error?.message || `Erro na API Groq (${response.status})`);
            }

            const text = data.choices?.[0]?.message?.content || "";
            return res.status(200).json({ text, images: [] });
        }

        // Default: Gemini Provider
        if (!geminiKey) {
            return res.status(500).json({ error: "GEMINI_API_KEY não configurada. Adicione-a na Vercel ou use o Groq." });
        }

        // Move initialization here to prevent top-level crashes if library behaves badly without key
        const ai = new GoogleGenAI({ apiKey: geminiKey });
        const response = await ai.models.generateContent({
            model: DEFAULT_MODEL,
            contents,
            config: config || {},
        });

        const text = response.text || "";
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
        console.error("ERRO TOTAL NA API:", error);
        return res.status(500).json({
            error: error.message || "Erro crítico no servidor de IA",
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
}
