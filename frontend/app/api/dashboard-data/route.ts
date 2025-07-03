import { NextRequest, NextResponse } from 'next/server';
//import { DashboardData } from '@/lib/types';

// Mock data - replace with actual database/API calls
const mockProducts = [
  {
    "source": "Nykaa",
    "description": "A face moisturizer formulated with 5.5% Vitamin B12 Repair Complex to help repair and strengthen the skin barrier, provide deep hydration, and soothe irritated skin. It is suitable for all skin types, especially those with compromised or sensitive skin.",
    "productLink": "https://www.nykaa.com/minimalist-vitamin-b12-repair-complex-5-5percent-face-moisturizer/p/20580868?productId=20580868&pps=1",
    "productName": "Minimalist Vitamin B12 Repair Complex 5.5% Face Moisturizer",
    "routineUsage": "After cleansing and toning, apply a sufficient amount of the moisturizer to your face and neck. Gently massage until fully absorbed. Use twice daily, in the morning and evening."
  },
  {
    "source": "Nykaa",
    "description": "This serum contains 10% Niacinamide (Vitamin B3) and Matmarine + Zinc to effectively reduce oil production, minimize blemishes, and improve skin texture. It helps to control acne and reduce the appearance of pores, making it ideal for oily and acne-prone skin. [2]",
    "productLink": "https://www.nykaa.com/minimalist-10percent-niacinamide-face-serum-with-matmarine-zinc-for-reducing-oil-blemishes/p/15022069?productId=15022069&pps=2",
    "productName": "Minimalist 10% Niacinamide Face Serum With Matmarine + Zinc For Reducing Oil & Blemishes",
    "routineUsage": "Apply 2-3 drops of the serum to your face after cleansing and toning. Gently pat until absorbed. Use twice daily, in the morning and evening. Follow with a moisturizer."
  },
  {
    "source": "Nykaa",
    "description": "A face serum formulated with 2% Salicylic Acid to exfoliate the skin, unclog pores, and reduce blackheads and whiteheads. It helps to control acne breakouts and improve overall skin clarity, making it suitable for oily and acne-prone skin.",
    "productLink": "https://www.nykaa.com/minimalist-2percent-salicylic-acid-face-serum-for-blackheads-whiteheads/p/15973485?productId=15973485&pps=3",
    "productName": "Minimalist 2% Salicylic Acid Face Serum For Blackheads & Whiteheads",
    "routineUsage": "After cleansing and toning, apply 2-3 drops of the serum to affected areas or all over the face. Gently pat until absorbed. Use once daily, preferably in the evening. Start with alternate days and increase frequency as tolerated. Always follow with sunscreen in the morning."
  },
  {
    "source": "Nykaa",
    "description": "A lightweight moisturizer with 10% Vitamin B5 (Panthenol) to provide intense hydration, soothe the skin, and support skin barrier function. It helps to improve skin elasticity and reduce dryness, suitable for all skin types, especially sensitive and dehydrated skin.",
    "productLink": "https://www.nykaa.com/minimalist-vitamin-b5-10percent-moisturizer/p/18876941?productId=18876941&pps=4",
    "productName": "Minimalist Vitamin B5 10% Moisturizer",
    "routineUsage": "After cleansing, toning, and applying serums, take a sufficient quantity of the moisturizer and massage into your face until fully absorbed. Use twice daily, in the morning and evening."
  },
  {
    "source": "Nykaa",
    "description": "A broad-spectrum sunscreen with SPF 50 and PA++++ protection, enriched with multi-vitamins to help reduce photoaging and provide antioxidant benefits. It offers high sun protection without leaving a white cast, suitable for all skin types.",
    "productLink": "https://www.nykaa.com/minimalist-spf-50-pa-sunscreen-with-multi-vitamin-for-reducing-photoaging-no-white-cast/p/17999996?productId=17999996&pps=5",
    "productName": "Minimalist SPF 50 PA++++ Sunscreen With Multi-Vitamin For Reducing Photoaging & No White Cast",
    "routineUsage": "Apply a generous amount of sunscreen as the last step of your morning skincare routine, at least 15-20 minutes before sun exposure. Reapply every 2-3 hours, or more frequently if swimming or sweating."
  },
  {
    "source": "Minimalist",
    "description": "An everyday moisturizing gel with 0.3% pure Ceramides (5 essential ceramides: NP, EOP, NS, AS, AP) to restore and repair the skin's natural barrier and prevent water loss. It is formulated with Ceramide:Cholesterol:Fatty Acid in a 3:1:1 ratio, which is proven to accelerate skin barrier recovery. Boosted with Madecassoside for soothing and Ursolic Acid for repairing damaged skin barrier. It also contains Aminobutyric Acid (GABA) and Aquaporin boosting ingredients for intense hydration. This lightweight formula is suitable for oily/combination and acne-prone skin. [6]",
    "productLink": "https://beminimalist.co/products/ceramides-0-3-madecassoside",
    "productName": "Ceramides 0.3% + Madecassoside Moisturizer",
    "routineUsage": "Use after cleansing, toning, and applying all serums. Take a sufficient quantity of the product and massage into the face until it is fully absorbed. Use both in the AM and PM, everyday. [6]"
  }
];

const mockEducational =[
    {
      "url": "https://www.sephora.com/buy/cica-skincare-products",
      "type": "article",
      "title": "Cica Skincare Products | Sephora",
      "description": "What it is: <strong>A cleanser that gently cleans, refreshes, and uses micellar technology to powerfully dissolve makeup without drying out skin</strong>. Highlighted Ingredients: - Cica (Centella Asiatica Extract): Soothes and calms sensitive skin, reduces moisture loss. - Willow Bark (Salix Alba Extract): ..."
    },
    {
      "url": "https://www.reddit.com/r/AsianBeauty/comments/6cnwdk/discussion_centella_asiatica_and_madecassoside/",
      "type": "article",
      "title": "r/AsianBeauty on Reddit: [Discussion] Centella asiatica and madecassoside!",
      "description": "113 votes, 68 comments. 3.5M subscribers in the AsianBeauty community. A place to discuss beauty brands, cosmetics, and skincare from Asia."
    },
    {
      "url": "https://www.byrdie.com/madecassoside-for-skin-5089372",
      "type": "article",
      "title": "Dermatologists Say Madecassoside Is a Promising Ingredient for Sensitive Skin",
      "description": "A choice pick for daytime, she ... delivering your daily dose of SPF 30. ... &quot;This is <strong>formulated with a combination of madecassoside, niacinamide, witch hazel, and panthenol to calm, brighten, tone, and hydrate the skin</strong>,&quot; says Dr...."
    },
    {
      "url": "https://nymag.com/strategist/article/best-skincare-products-for-redness-and-rosacea.html",
      "type": "article",
      "title": "15 Best Skin-Care Products for Redness and Rosacea 2025 | The Strategist",
      "description": "This is where the actives come in. For red and rosacea-prone skin, you want soothers and anti-inflammatories like ambophenol, azelaic acid, and <strong>centella asiatica</strong>. You can choose one product from the selection below, or combine. Don’t go adding in everything at once, though: If you subsequently ..."
    },
    {
      "url": "https://simpleskincarescience.com/fungal-acne-products-malassezia-pityrosporum-folliculitis/",
      "type": "article",
      "title": "1500+ Fungal Acne Safe Products: An Updated List of Skincare For Malassezia",
      "description": "A list of over 1,400 <strong>products</strong> that are safe for fungal acne including <strong>cleansers</strong>, toners, chemical exfoliants, <strong>serums</strong>, <strong>sunscreens</strong>, makeup, masks and more!"
    },
    {
      "url": "https://www.sephora.com/ca/en/buy/skin-care-products-for-redness",
      "type": "article",
      "title": "Skin Care Products For Redness | Sephora Canada",
      "description": "What it is: <strong>A soft, cooling gel cream moisturizer that quickly hydrates, soothes visible redness, and supports the skin barrier</strong>. Skin Type: Normal, Dry, Combination, and Oily Skincare Concerns: Dryness and Redness Formulation: Cream Highlighted Ingredients: - Cica Complex (Centella Asiatica): ..."
    },
    {
      "url": "https://www.nykaaman.com/",
      "type": "article",
      "title": "Nykaa Man - Flat ₹400* off on 1st App Order",
      "description": "<strong>Nykaa</strong> Man offers a wide range of men&#x27;s <strong>products</strong> like skincare, haircare, fragrances, sneakers, fashion &amp; more. Shop online from top brands like The Ordinary, CeraVe, New Balance, YSL, JPG &amp; More"
    },
    {
      "url": "https://healthandglow.com/",
      "type": "article",
      "title": "Health & Glow",
      "description": "Welcome to Health &amp; Glow, your ultimate destination to cater to all your beauty and personal care requirements. With over 10,000 <strong>products</strong> <strong>from</strong> 800+ domestic and global brands, we are here with an exciting and user-friendly e-commerce platform to serve a seamless shopping experience."
    },
    {
      "url": "https://luminli.com/best-products-for-reducing-redness-on-the-face/",
      "type": "article",
      "title": "The 7 Best Products for Reducing Redness on the Face​ - Luminli",
      "description": "Best <strong>Products</strong> for Reducing <strong>Redness</strong> on the Face​: 1. La Roche-Posay Toleriane Ultra Soothing Moisturizer​ · 2. Dr. Jart+ Cicapair Tiger Grass ..."
    },
    {
      "url": "https://www.cultbeauty.co.uk/blog/skin-care-tips-for-redness/",
      "type": "article",
      "title": "Our Soothing Skin Care Tips For Redness | Cult Beauty",
      "description": "Find out Team Cult Beauty’s top <strong>skin</strong> care tips for <strong>redness</strong> and our complexion-soothing favourites, from calming creams and <strong>cleansers</strong> to ultra-hydrating <strong>serums</strong>."
    },
    {
      "url": "https://www.vogue.com/article/simplified-skincare-routine",
      "type": "article",
      "title": "My Simplified Skin Care Routine Has Yielded My Most Glowing Complexion Yet | Vogue",
      "description": "By prioritizing <strong>skin</strong> barrier repair versus exfoliating treatments, I have achieved a softer, brighter complexion. A look at the five-step <strong>routine</strong> I now swear by."
    },
    {
      "url": "https://www.nykaa.com/beauty-blog/daily-skin-care-routine-to-get-you-going/",
      "type": "article",
      "title": "Daily Skincare Routine Guide With Effective Tips For All Skin Types",
      "description": "Want a better daily skincare <strong>routine</strong>? <strong>Our</strong> <strong>guide</strong> offers effective tips for all <strong>skin</strong> types, covering daily face care <strong>routines</strong> and daily body care <strong>routines</strong> to enhance your <strong>skin</strong>."
    },
    {
      "url": "https://btyaly.com/focus-on/focus-on-centella-asiatica-and-the-cica-trend/",
      "type": "article",
      "title": "Focus on: Centella Asiatica (and the “cica” trend) | BTY ALY",
      "description": "Focus on: <strong>Centella</strong> <strong>Asiatica</strong> (and the “<strong>cica</strong>” trend), a cosmetic trend for sensitive <strong>skins</strong>, sensitized by pollution, and acne prone <strong>skins</strong>."
    },
    {
      "url": "https://www.self.com/story/centella-asiatica-sensitive-skin",
      "type": "article",
      "title": "What Can Centella Asiatica Really Do for Red, Dry, Sensitive Skin? | SELF",
      "description": "<strong>Centella</strong> <strong>asiatica</strong> is popping up in more and more <strong>skin</strong>-care <strong>products</strong> aimed at those with sensitive, inflamed <strong>skin</strong>. Here&#x27;s what you need to know."
    }
  ];

export async function GET(request: NextRequest) {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const data: any = {
      products: mockProducts,
      educational: mockEducational
    };

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}
export const dynamic = 'force-dynamic'; // Ensure this route is always fresh
export const revalidate = 0; // Disable static caching for this route
// This ensures the data is always fetched fresh from the server
// and not cached by Next.js or any CDN.