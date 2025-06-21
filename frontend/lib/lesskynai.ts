'use server';
import { GoogleGenAI, Type } from "@google/genai";
import { safetySettings } from "./Aiconfig";
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
import { ProductResult } from "./types";
import { safeParseGeminiJSON } from "./utils";
import { scrapeNykaaFromMultiple } from "./scraper";
import data from "@/lib/data"
type Skincare = {
  "Skin type": string;
  "Concern": string;
  "Commitment Level": string;
  "Product Suggestion AM": string;
  "Product Suggestion PM": string;
  "Weekly Treatments": string;
  "Other Suggestion": string;
};

const skincare: Skincare[] = data as Skincare[]; 

function isCategoryOrBrandPage(url: string) {
  return /nykaa\.com\/brands\/.+\/c\/\d+/.test(url);
}

async function geminiai(products: ProductResult[],skinconcern:string,skinType:string,routineType:string) {

  function getRelevantProducts(routineType: string): string {
  if (!routineType) return "cleanser serum moisturizer sunscreen";

  const query = routineType.toLowerCase().trim();

  const matchedEntry = skincare.find(
    entry => entry["Commitment Level"].toLowerCase().trim() === query
  );

  if (matchedEntry) {
    const Weeklysuggestions=matchedEntry["Weekly Treatments"] ||"";
    const Othersuggestions=matchedEntry["Other Suggestion"] || "";
    const amProducts = matchedEntry["Product Suggestion AM"] || "";
    const pmProducts = matchedEntry["Product Suggestion PM"] || "";

    return cleanProducts(`AM product:${amProducts} and PM products:${pmProducts} and Weekly Treatments:${Weeklysuggestions} and Other suggestions:${Othersuggestions}`);
  }

  return "cleanser serum moisturizer sunscreen";
}
const result =getRelevantProducts(routineType);
function cleanProducts(raw: string): string {
  return Array.from(
    new Set(
      raw
        .replace(/<br\s*\/?>/gi, " ")   
        .replace(/\n/g, " ")
        .toLowerCase()
        .match(/\b\w+\b/g) || []
    )
  ).join(" ");
}

  const urls = (products || [])
    .map(p => p?.url)
    .filter(link => typeof link === "string" && link.startsWith("http"));

  console.log("Gemini AI processing URLs:", urls);
  if (urls.length === 0) {
    console.warn("No valid product URLs found for Gemini processing.");
    return [];
  }
  
  // Filter out category or brand pages
  const filteredUrls = (urls as string[]).filter((url: string) => isCategoryOrBrandPage(url));
  const data = await scrapeNykaaFromMultiple(filteredUrls, 5);
  //const minimalistData = await scrapeMinimalistStructured((urls as string[]).filter(p => !isCategoryOrBrandPage(p || "") && typeof p === "string"), 5);
  const limitedData = [
    ...data,
    ...(urls as string[]).filter(p => !isCategoryOrBrandPage(p || "") && typeof p === "string")
  ];
  console.log("Filtered URLs for Gemini:", limitedData);
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `You are a product recommendation assistant and an expert data extractor.Your task is to generate structured product information based on the user’s skincare profile.
              You will receive a list of productsUrls.
              For each productUrl, your job is to ensure all required fields are populated.
              Return an array of JSON objects. Each object should have:
              - 'products': an array of objects with:
                  - productName: (string) The name of the product.
                  - productLink: (string) The URL of the product page. If the URL is missing or invalid, use the provided productUrl.
                  - description: (string) A clear summary of what the product does, its benefits, key ingredients, and who it's for.
                  - source: (string) The source of the product information, e.g., "Nykaa", "Minimalist", or "Other".

              - 'routineUsage': Instructions for the routineUsage field:
                  - Use the user's **routine type**: "${routineType}" to decide how to structure the routine.
                  - Also consider their **skin type**: "${skinType}" and **concerns**: "${skinconcern}" while suggesting use instructions.
                  - Incorporate product functionality based on its name or description.
                  - The routineUsage should:
                    - Clearly differentiate between **AM and PM** usage.
                    - Be written in step-wise order.
                    - Optionally include weekly treatments or special instructions if relevant.
                  Use the following extracted keywords for routine building:${getRelevantProducts(routineType)}
              ⚠ Output must be valid JSON. No prose, no explanations, just raw JSON.
              Here is the list of products to enrich:\n\n${limitedData.map(p => p).join("\n")}`
            }
          ]
        }
      ],
      config: {
        tools: [{urlContext: {}}],
        thinkingConfig: { thinkingBudget: 0 },
        safetySettings,
        systemInstruction: {
          role: "system",
          parts: [
            {
              text: "You are LesSkyn AI, an expert assistant that extracts structured skincare product data. No ads. No irrelevant UI elements.Output must be valid JSON."
            }
          ]
        },
        temperature: 0.3,
        topP: 1,
        topK: 0,
        maxOutputTokens: 4000,
        responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            products: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  productName: { type: Type.STRING },
                  productLink: { type: Type.STRING },
                  description: { type: Type.STRING },
                  source: { type: Type.STRING }
                },
                propertyOrdering: [
                  "productName",
                  "productLink",
                  "description",
                  "source"
                ]
              }
            },
            routineUsage: {
              type: Type.STRING
            }
          },
          propertyOrdering: ["products", "routineUsage"]
        }
      }
  },
});

    const json = response.text;
    if (!json) {
    console.error("❌ Gemini response text is undefined.");
    return [];
    }

    let parsed = [];
    try {
    parsed = safeParseGeminiJSON(json);
    } catch (err) {
    console.error("❌ Failed to parse Gemini response:", err);
    }

    return parsed;
  } catch (err) {
    console.error("Gemini request failed:", err);
    return [];
  }
}

export default geminiai;
