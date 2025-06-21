import * as cheerio from 'cheerio';

export async function scrapeNykaaFromMultiple(categoryUrls: string[], maxTotal: number = 5): Promise<string[]> {
  const productUrls = new Set<string>();

  try {
    for (const categoryUrl of categoryUrls) {
      let currentPage = 1;

      while (productUrls.size < maxTotal) {
        const paginatedUrl = `${categoryUrl}${categoryUrl.includes('?') ? '&' : '?'}page=${currentPage}`;
        console.log(`🔍 Visiting: ${paginatedUrl}`);

        try {
          const res = await fetch(paginatedUrl, {
            headers: {
              'User-Agent':
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36',
            },
            cache: 'no-store',
          });

          if (!res.ok) {
            console.warn(`⚠️ Failed to fetch page: ${paginatedUrl}`);
            break;
          }

          const html = await res.text();
          const $ = cheerio.load(html);

          $('#product-list-wrap .productWrapper a').each((_, el) => {
            if (productUrls.size >= maxTotal) return;
            const href = $(el).attr('href');
            if (href && href.includes('/p/')) {
              const fullUrl = 'https://www.nykaa.com' + href;
              productUrls.add(fullUrl);
            }
          });

          if ($('button[aria-label="Next Page"][disabled]').length > 0) break;
          currentPage++;
        } catch (err) {
          console.warn(`⚠️ Skipping failed page: ${paginatedUrl}`, err);
          break;
        }
      }

      if (productUrls.size >= maxTotal) break;
    }
  } catch (err) {
    console.error('❌ Scraping Failed:', err);
  }

  return Array.from(productUrls);
}

// export async function scrapeMinimalistStructured(urls: string[], maxTotal: number = 5): Promise<any[]> {
//   const productData: any[] = [];

//   const minimalistProductPattern = /^https:\/\/beminimalist\.co\/products\//;
//   const productUrls = urls.filter(url => minimalistProductPattern.test(url));

//   for (const url of productUrls) {
//     if (productData.length >= maxTotal) break;
//     try {
//       const res = await fetch(url, {
//         headers: {
//           'User-Agent':
//             'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36',
//         },
//         cache: 'no-store',
//       });

//       if (!res.ok) {
//         console.warn(`⚠️ Failed to fetch: ${url}`);
//         continue;
//       }

//       const html = await res.text();
//       const $ = cheerio.load(html);

//       const productName = $('h1.product-title').text().trim() || 'Unknown Product';
//       const productLink = url;
//       const thumbnail = $('img.product-main-image').attr('src') ||
//                         $('meta[property="og:image"]').attr('content') ||
//                         '';
//       const description = $('div.product-description').text().trim() ||
//                           $('meta[name="description"]').attr('content') ||
//                           'No description available';
//       const routineUsage = `Apply ${productName.split(' ')[0]} as directed in your daily skincare routine.`;

//       productData.push({
//         productName,
//         productLink,
//         thumbnail,
//         description,
//         routineUsage,
//         source: 'Minimalist'
//       });
//     } catch (err) {
//       console.warn(`❌ Failed to scrape: ${url}`, err);
//     }
//   }

//   return productData;
// }
