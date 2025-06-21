import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseclient";
import { searchWithBrave, buildSearchQuery } from "@/lib/search";
import { withTimeout,enrichProductsAsync } from "@/lib/utils";
import { RequestBody, ApiResponse, SearchResult } from "@/lib/types";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body: RequestBody = await req.json();
    const { email_id, ...updateFields } = body;

    if (!email_id) {
      return NextResponse.json({ error: "Missing email_id" }, { status: 400 });
    }

    if (!updateFields.skinType && !updateFields.skinConcern && 
        !updateFields.routineType) {
      return NextResponse.json({ error: "No profile fields provided" }, { status: 400 });
    }

    const hasCompleteProfile = Boolean(
      updateFields.skinType && 
      updateFields.skinConcern && 
      updateFields.routineType
    );

    const operations: [Promise<any>, Promise<SearchResult | null>] = [
      // User validation with timeout
      withTimeout(
        (async () => await supabase.from("User").select("id").eq("email_id", email_id).single())(),
        5000
      ),

      hasCompleteProfile 
        ? withTimeout(
            searchWithBrave(buildSearchQuery(
              updateFields.skinType!,
              updateFields.skinConcern!,
              updateFields.routineType!
            )),
            10000 // 10s timeout for search
          )
        : Promise.resolve(null)
    ];

    const [userResult, searchResult] = await Promise.allSettled(operations);

    if (userResult.status === 'rejected' || !userResult.value?.data) {
      console.error("User validation failed:", userResult);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { data: profileData, error: insertError } = await supabase
      .from("UserProfile")
      .insert([{
        userEmail: email_id,
        skinType: updateFields.skinType || null,
        skinConcern: updateFields.skinConcern || null,
        routineType: updateFields.routineType || null,
        search_status: hasCompleteProfile ? 'pending' : 'skipped',
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (insertError) {
      console.error("Profile insert failed:", insertError);
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    const response: ApiResponse = {
      message: "User profile created successfully",
      profile: profileData,
      recommendations: null,
      processing_status: "completed"
    };

    if (hasCompleteProfile) {
      if (searchResult.status === 'fulfilled' && searchResult.value) {
        const searchData = searchResult.value;
        
        response.recommendations = {
          query_used: buildSearchQuery(
            updateFields.skinType!,
            updateFields.skinConcern!,
            updateFields.routineType!
          ),
          products: searchData.products || [],
          educational: searchData.educational || [],
          total_results: searchData.total_results || 0,
          generated_at: new Date().toISOString(),
          enrichment_status: "processing" 
        };

        await supabase
          .from("UserProfile")
          .update({ 
            search_results: searchData,
            search_status: 'completed',
            search_completed_at: new Date().toISOString()
          })
          .eq("id", profileData.id);

        if (searchData.products && searchData.products.length > 0) {
          enrichProductsAsync(
            searchData.products,
            profileData.id,
            updateFields.skinType ?? "",
            updateFields.skinConcern ?? "",
            updateFields.routineType ?? ""
          )
            .catch(err => console.error('Background enrichment setup failed:', err));
        }

        response.processing_status = "search_completed_enrichment_processing";
        
      } else {
        console.error("Search failed:", searchResult);
        
        response.recommendations = {
          error: "Search temporarily unavailable",
          fallback_message: "Please check back later for personalized recommendations",
          enrichment_status: "failed"
        };

        await supabase
          .from("UserProfile")
          .update({ 
            search_status: 'failed',
            search_error: searchResult instanceof Error 
              ? searchResult 
              : 'Unknown search error',
            search_completed_at: new Date().toISOString()
          })
          .eq("id", profileData.id);
      }
    } else {
      response.recommendations = {
        message: "Complete your profile (skin type, concern, and routine) to get personalized recommendations"
      };
    }

    console.log("Profile created:", {
      profile_id: profileData.id,
      has_search_results: Boolean(response.recommendations?.products),
      processing_status: response.processing_status
    });

    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json({ 
      error: "Internal server error",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}
