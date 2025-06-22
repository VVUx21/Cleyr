"use server";
import { ProcessedResults } from "@/lib/types";
import data from "@/lib/data"
// Brave Search API configuration

type SkincareEntry = {
  "Skin type": string;
  "Concern": string;
  "Essential Ingredients to Look For": string;
  "Preferred Skincare Ingredients/Products": string;
  // other fields are optional for this function
};

const skincareData: SkincareEntry[] = data as SkincareEntry[]; 
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

function buildSearchQuery(
    skinType: string,
    skinConcern: string,
    routineType: string
) {
  const baseQuery = `${skinType} skin ${skinConcern} routine`;
  const platforms = "nykaa amazon flipkart beminimalist BeautyBay Sephora CultBeauty";
  const content = "guides tutorials articles";
  const ingredients = getRelevantIngredients(skinConcern);
  const products = getRelevantProducts(routineType);
  
  return `${baseQuery} PRODUCTS FROM ${platforms} ${content} ${ingredients} ${products}`.trim();
}

// Helper function to get relevant ingredients based on skin concern
function getRelevantIngredients(skinConcern: string): string {
  if (!skinConcern) return "niacinamide hyaluronic acid";

  const query = skinConcern.toLowerCase().trim();

  const exactMatch = skincareData.find(
    entry => entry["Concern"].toLowerCase().trim() === query
  );
  if (exactMatch) {
    return cleanIngredients(exactMatch["Essential Ingredients to Look For"]);
  }

  const partialMatch = skincareData.find(
    entry => query.includes(entry["Concern"].toLowerCase().trim()) ||
             entry["Concern"].toLowerCase().includes(query)
  );
  if (partialMatch) {
    return cleanIngredients(partialMatch["Essential Ingredients to Look For"]);
  }

  return "niacinamide hyaluronic acid";
}

function cleanIngredients(raw: string): string {
  return raw.replace(/•/g, "").replace(/\n/g, " ").trim();
}

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

// Helper: convert HTML tags to words and remove duplicates
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

async function searchWithBrave(query: string, timeoutMs = 8000): Promise<ProcessedResults> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const params = new URLSearchParams({
      q: query,
      count: '20', // number of results
      safesearch: 'moderate', // optional: off | moderate | strict
      search_lang: 'en' ,// optional: to set language
      country: 'US', // optional: to set country
    });

    const response = await fetch(`https://api.search.brave.com/res/v1/web/search?${params}`, {
      method: 'GET',
       headers: {
        'Accept': 'application/json',
        'Accept-Encoding': 'gzip',
        'x-subscription-token': 'BSAsq3rq45RVWShBdJUPkT1tJaB0ZPW',
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Brave API error: ${response.status} ${response.statusText} — ${errorText}`);
    }

    const data = await response.json();

    if (!data?.web?.results) {
      return { products: [], educational: [], total_results: 0 };
    }

    const results = processBraveSearchResults(data);
    return {
      products: results.products,
      educational: results.educational,
      total_results: data.web.total_results || 0,
    };
  } catch (error: any) {
    clearTimeout(timeoutId);
    console.error('Brave Search Error:', error.message);
    return {
      products: [],
      educational: [],
      total_results: 0,
      error: error.message
    };
  }
}


function isString(value: any): value is string {
        return typeof value === 'string';
    }

    function isProductResult(result: { url: string | string[], title: string,subtype:string }): boolean {
        const title = result.title.toLowerCase();
        //const url = isString(result.url) ? result.url : "";
        const subtype = result.subtype ?? "";
        return (
            title.includes("buy") ||
            title.includes("price")||
            subtype.includes("product")
        );
    }

    function isEducationalResult(result: { url: string | string[], title: string,subtype:string }): boolean {
        const title = result.title.toLowerCase();
        const url = isString(result.url) ? result.url : "";
        const subtype = result.subtype ?? "";
        return (
            title.includes("guide") ||
            url.includes("youtube.") ||
            url.includes("blog")||
            subtype.includes("article")||
            subtype.includes("generic")||
            subtype.includes("qa")
        );
    }

    function processBraveSearchResults(data: any) {
        const results = data?.web?.results || [];

        const processedResults = {
            products: [] as {
            title: string;
            url: string;
            description: string;
            source: string;
            }[],
            educational: [] as {
            title: string;
            url: string;
            description: string;
            type: "video" | "article";
            }[]
        };

        results.forEach((result: any) => {
            const title = result.title;
            const url = result.url;
            const description = result.description || "";

            if (!isString(title) || !isString(url)) return;

            if (isProductResult(result)) {
            processedResults.products.push({
                title,
                url,
                description,
                source: extractSource(url)
            });
            } else if (isEducationalResult(result)) {
            processedResults.educational.push({
                title,
                url,
                description,
                type: url.includes("youtube.") ? "video" : "article"
            });
            }
        });

        return processedResults;
    }
// Helper to extract source from URL
function extractSource(url:string | string[]) {
  if (Array.isArray(url)) {
    url = url[0]; // Use the first URL if multiple are provided
  }
  if (url.includes('amazon.')) return 'Amazon';
  if (url.includes('nykaa.')) return 'Nykaa';
  if (url.includes('myntra.')) return 'Myntra';
  if (url.includes('flipkart.')) return 'Flipkart';
  return 'Other';
}

export {
    buildSearchQuery,
    searchWithBrave
};