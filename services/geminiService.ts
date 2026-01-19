
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { QuestionData, ImageFile } from "../types";

export const generateQuestionFromImages = async (images: ImageFile[]): Promise<QuestionData> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `قم بتحليل هذه الصور (عددها ${images.length}) وقم بإنشاء سؤال تعليمي واحد عالي الجودة متعدد الخيارات باللغة العربية بناءً على محتواها المشترك أو المعلومات الموجودة فيها.
  يجب أن يكون السؤال دقيقاً وتعليمياً. قدم أربعة خيارات وحدد الإجابة الصحيحة مع شرح بسيط وواضح.`;

  const imageParts = images.map(img => ({
    inlineData: {
      data: img.base64.split(',')[1],
      mimeType: img.mimeType,
    },
  }));

  const response: GenerateContentResponse = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [
      {
        parts: [
          { text: prompt },
          ...imageParts
        ],
      },
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          question: {
            type: Type.STRING,
            description: "نص السؤال التعليمي باللغة العربية",
          },
          options: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "قائمة من 4 خيارات للإجابة",
          },
          correctIndex: {
            type: Type.INTEGER,
            description: "مؤشر الإجابة الصحيحة (0-3)",
          },
          explanation: {
            type: Type.STRING,
            description: "شرح بسيط لماذا هذه هي الإجابة الصحيحة",
          },
        },
        required: ["question", "options", "correctIndex", "explanation"],
      },
    },
  });

  const jsonStr = response.text?.trim();
  if (!jsonStr) throw new Error("لم يتم استلام استجابة صحيحة من الذكاء الاصطناعي");
  
  return JSON.parse(jsonStr) as QuestionData;
};
