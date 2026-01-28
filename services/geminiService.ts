
import { GoogleGenAI } from "@google/genai";

// Initialize the GoogleGenAI client directly using the environment variable as required.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateNewsDraft(topic: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Rédige un article court (200 mots) sur les Filles de Marie Auxiliatrice de Madagascar concernant le sujet suivant: ${topic}. L'article doit être inspirant, axé sur la jeunesse et l'éducation salésienne.`,
      config: {
        temperature: 0.7,
        topP: 0.95,
      }
    });
    // Use the .text property directly to extract text output.
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Impossible de générer le brouillon pour le moment.";
  }
}

export async function translateToMalagasy(text: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Traduis ce texte en Malagasy formel: ${text}`,
    });
    // Use the .text property directly to extract text output.
    return response.text;
  } catch (error) {
    console.error("Translation Error:", error);
    return text;
  }
}