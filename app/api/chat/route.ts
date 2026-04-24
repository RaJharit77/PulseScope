import { NextResponse } from 'next/server';

const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;
const MODEL = 'microsoft/DialoGPT-medium'; // ou 'HuggingFaceH4/zephyr-7b-beta'

export async function POST(req: Request) {
    try {
        const { message } = await req.json();
        if (!message) {
            return NextResponse.json({ error: 'Message requis' }, { status: 400 });
        }

        const response = await fetch(
            `https://api-inference.huggingface.co/models/${MODEL}`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${HF_API_KEY}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    inputs: message,
                    parameters: {
                        max_new_tokens: 150,
                        temperature: 0.7,
                        top_p: 0.9,
                    },
                }),
            }
        );

        const data = await response.json();
        // La réponse varie selon le modèle, adapter si nécessaire
        const reply = data[0]?.generated_text || data.generated_text || "Désolé, je n'ai pas compris.";

        return NextResponse.json({ reply });
    } catch (error) {
        console.error('Chat API error:', error);
        return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
    }
}