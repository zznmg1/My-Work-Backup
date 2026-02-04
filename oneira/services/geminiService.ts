import { GoogleGenAI, Type } from "@google/genai";
import { FortuneType, FortuneResult } from "../types";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API Key not found via process.env.API_KEY");
    // In a real app, we'd handle this better, but for this demo we assume it exists
    // or the call will fail gracefully in the catch block.
  }
  return new GoogleGenAI({ apiKey: apiKey || 'demo_key' }); // Fallback to avoid crash on init, call will fail if invalid
};

export const generateFortune = async (type: FortuneType, userContext?: string): Promise<FortuneResult> => {
  try {
    const ai = getClient();
    
    let prompt = "";
    
    if (type === FortuneType.DREAM) {
      prompt = `Interpret the following dream deeply and mystically. The user said: "${userContext}". 
      Provide a "Legendary" style one-word title (e.g. "REVELATION", "AWAKENING"), a short subtitle phrase (e.g. "The shadows whisper truth"), and a profound 2-sentence interpretation.`;
    } else if (type === FortuneType.ORACLE) {
      prompt = `Provide a daily oracle card reading. The theme is general guidance. 
      Provide a powerful one-word title (e.g. "VIGILANCE", "CLARITY"), a short subtitle, and a mystical 2-sentence advice for today.`;
    } else {
      prompt = `Provide a soul connection reading regarding relationships and inner self. 
      Provide a romantic or spiritual one-word title (e.g. "UNION", "SOLITUDE"), a subtitle, and 2 sentences of guidance.`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            subtitle: { type: Type.STRING },
            description: { type: Type.STRING },
          },
          required: ["title", "subtitle", "description"],
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    const json = JSON.parse(text);

    return {
      title: json.title,
      subtitle: json.subtitle,
      description: json.description,
      type: type,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      icon: type === FortuneType.DREAM ? 'mode_night' : type === FortuneType.ORACLE ? 'visibility' : 'favorite'
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    // Fallback if API fails
    return {
      title: "MYSTERY",
      subtitle: " The void is silent today",
      description: "The stars are clouded, but your inner light remains. Try again later when the cosmic winds shift.",
      type: type,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      icon: 'auto_awesome'
    };
  }
};
