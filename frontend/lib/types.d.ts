//Define interfaces for result items
export interface ProductResult {
  title: string;
  url: string | string[];
  description: any;
  source: string;
}

interface EducationalResult {
  title: string;
  url: string | string[];
  description: any;
  type: string;
}

export interface ProcessedResults {
  products: ProductResult[];
  educational: EducationalResult[];
  total_results: number;
  error?: string;
}

export interface UpdateFields {
  skinType?: string;
  skinConcern?: string;
  routineType?: string;
}

export interface RequestBody extends UpdateFields {
  email_id: string;
}

export interface SearchResult {
  products?: any[];
  educational?: any[];
  total_results?: number;
  [key: string]: any;
}

export interface RecommendationsResponse {
  query_used?: string;
  products?: any[];
  educational?: any[];
  enriched_products?: any[];
  total_results?: number;
  error?: string;
  fallback_message?: string;
  generated_at?: string;
  enrichment_status?: 'processing' | 'completed' | 'failed';
  message?: string;
}

export interface ApiResponse {
  message: string;
  profile: any;
  recommendations: RecommendationsResponse | null;
  processing_status: string;
}

export interface EnrichmentStatusResponse {
  enrichment_status: 'processing' | 'completed' | 'failed';
  enriched_recommendations?: any;
  completed_at?: string;
  started_at?: string;
  duration_ms?: number;
  product_count?: number;
  error?: string;
}

export interface Product {
  source: string;
  productLink: string;
  productName: string;
  description: string;
  routineUsage: string;
}

export interface EducationalContent {
  url: string;
  type: string;
  title: string;
  description: string;
}

export interface DashboardData {
  products: Product[];
  educational: EducationalContent[];
}