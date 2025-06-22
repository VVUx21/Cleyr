import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { supabase } from "./supabaseclient"
import geminiai from "./lesskynai"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Timeout wrapper for external API calls
export const withTimeout = <T>(promise: Promise<T>, timeoutMs: number): Promise<T> => {
  const timeoutPromise = new Promise<T>((_, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error(`Operation timed out after ${timeoutMs}ms`));
    }, timeoutMs);
    
    // Clear timeout if original promise resolves first
    promise.finally(() => clearTimeout(timeoutId));
  });
  
  return Promise.race([promise, timeoutPromise]);
};

export const withRetry = async <T>(
  fn: () => Promise<T>, 
  maxAttempts: number = 3, 
  baseDelay: number = 1000
): Promise<T> => {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');
      
      if (attempt === maxAttempts) {
        throw lastError;
      }
      
      // Exponential backoff: 1s, 2s, 4s
      const delay = baseDelay * Math.pow(2, attempt - 1);
      console.log(`Attempt ${attempt} failed, retrying in ${delay}ms:`, lastError.message);
      
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError!;
};

// Batch processing for large product arrays
export const processBatchedEnrichment = async (
  products: any[], 
  batchSize: number = 10,
  skinConcern:string,
  skinType:string,
  routineType:string
): Promise<any[]> => {
  const batches: any[][] = [];
  
  // Split products into batches
  for (let i = 0; i < products.length; i += batchSize) {
    batches.push(products.slice(i, i + batchSize));
  }
  
  const enrichedBatches: any[] = [];
  
  // Process batches sequentially to avoid overwhelming the AI API
  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];
    console.log(`Processing batch ${i + 1}/${batches.length} (${batch.length} products)`);
    
    try {
      const enrichedBatch = await withTimeout(
        withRetry(() => geminiai(batch,skinConcern,skinType,routineType), 2), // 2 retries per batch
        30000 // 30s timeout per batch
      );
      
      enrichedBatches.push(...(Array.isArray(enrichedBatch) ? enrichedBatch : [enrichedBatch]));
      
      // Small delay between batches to be respectful to the API
      if (i < batches.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
    } catch (error) {
      console.error(`Batch ${i + 1} failed:`, error);
      // Continue with other batches, add error markers for failed items
      enrichedBatches.push(...batch.map(product => ({
        ...product,
        enrichment_error: 'AI processing failed',
        enrichment_status: 'failed'
      })));
    }
  }
  
  return enrichedBatches;
};

export async function enrichProductsAsync(products: any[], profileId: string, skinType:string,skinConcern:string,routineType:string): Promise<void> {
  const startTime = Date.now();
  
  try {
    console.log(`Starting background AI enrichment for profile ${profileId} with ${products.length} products`);
    
    await supabase
      .from("UserProfile")
      .update({ 
        enrichment_status: 'processing',
        enrichment_started_at: new Date().toISOString()
      })
      .eq("id", profileId);
    
    let enrichedData: any[];
    
    if (products.length <= 5) {
      enrichedData = await withTimeout(
        withRetry(() => geminiai(products,skinConcern,skinType,routineType), 3), // 3 retries for small batches
        45000 // 45s timeout for small batches
      );
    } else {

      enrichedData = await processBatchedEnrichment(products, 5,skinConcern,skinType,routineType);
    }
    
    const { error } = await supabase
      .from("UserProfile")
      .update({ 
        enriched_recommendations: enrichedData,
        enrichment_status: 'completed',
        enrichment_completed_at: new Date().toISOString(),
        enrichment_duration_ms: Date.now() - startTime
      })
      .eq("id", profileId);

    if (error) {
      throw new Error(`Database update failed: ${error.message}`);
    }
    
    const duration = Date.now() - startTime;
    console.log(`AI enrichment completed for profile ${profileId} in ${duration}ms`);
    
  } catch (error) {
    const duration = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    console.error(`AI enrichment failed for profile ${profileId} after ${duration}ms:`, errorMessage);
    
    await supabase
      .from("UserProfile")
      .update({ 
        enrichment_status: 'failed',
        enrichment_error: errorMessage,
        enrichment_completed_at: new Date().toISOString(),
        enrichment_duration_ms: duration,
        product_count_attempted: products.length
      })
      .eq("id", profileId);
  }
}

export function safeParseGeminiJSON(raw: string): any[] {
  try {
    let cleaned = raw
      .replace(/^\s*```json\s*/i, "")
      .replace(/^\s*```\s*/i, "")
      .replace(/```$/, "")
      .trim();

    cleaned = cleaned.replace(/,\s*([}\]])/g, "$1");

    return JSON.parse(cleaned);
  } catch (e) {
    console.error("❌ Failed to parse Gemini response as JSON:", e);
    console.warn("🧹 Raw Gemini output that failed parsing:\n", raw);
    return [];
  }
}
