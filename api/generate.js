import { GoogleGenAI } from "@google/genai";

const geminiKey = process.env.GEMINI_API_KEY || "";
const groqKey = process.env.GROQ_API_KEY || "";
const ai = new GoogleGenAI({ apiKey: geminiKey });
const DEFAULT_MODEL = "gemini-2.0-flash";
const GROQ_MODEL = "llama-3.3-70b-versatile";

export default async function handler(req, res) {
    // Only allow POST
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { contents, config, provider } = req.body;

    console.log(`[API] Provider: ${provider || 'gemini'} | Has Gemini Key: ${!!geminiKey} | Has Groq Key: ${!!groqKey}`);

    if (!contents) {
        return res.status(400).json({ error: "Campo 'contents' é obrigatório." });
    }

    // Handle Groq Provider
    if (provider === "groq") {
        if (!groqKey) {
            return res.status(500).json({ error: "GROQ_API_KEY não configurada no servidor Vercel. Adicione-a nas configurações." });
        }

        try {
            let prompt = "";
            if (typeof contents === "string") {
                prompt = contents;
            } else if (contents.parts) {
                // Better extraction for Groq (skipping non-text parts like PDF/Images for now)
                prompt = contents.parts
                    .map(p => p.text)
                    .filter(Boolean)
                    .join("\n");
            } else if (Array.isArray(contents)) {
                prompt = JSON.stringify(contents);
            }

            if (!prompt) {
                throw new Error("O conteúdo enviado é incompatível com o Groq (provavelmente um arquivo PDF ou imagem que o Groq não consegue ler diretamente).");
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

        } catch (error) {
            console.error("Erro na API Groq:", error);
            return res.status(500).json({
                error: error.message || "Erro desconhecido na API Groq",
            });
        }
    }

    // Default: Gemini Provider
    if (!geminiKey) {
        return res.status(500).json({ error: "GEMINI_API_KEY não configurada no servidor Vercel. Adicione-a nas configurações." });
    }

    try {
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
        console.error("Erro na API Gemini:", error);
        return res.status(500).json({
            error: error.message || "Erro desconhecido na API Gemini",
        });
    }
}
