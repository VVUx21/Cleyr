const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteer.use(StealthPlugin());

const nykaaScrap = async (browser, query) => {
    console.log(`Searching for: ${query}`);
    // Launch the browser and open a new blank page
    // const browser = await puppeteer.launch({ headless: false, defaultViewport: null });
    const page = await browser.newPage();
    await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36'
    );

    await page.goto('https://www.nykaa.com/', { waitUntil: 'networkidle2' });

    // Set screen size
    // await page.setViewport({ width: 1080, height: 1024 });

    await page.waitForSelector('input[placeholder="Search on Nykaa"]');
    await page.type('input[placeholder="Search on Nykaa"]', query);

    await page.keyboard.press('Enter');

    await page.waitForSelector('#product-list-wrap .productWrapper');
    // await page.waitForTimeout(7000);
    const products = await page.evaluate(() => {
        const items = [];
        const productEls = document.querySelectorAll('#product-list-wrap .productWrapper');

        for (let i = 0; i < productEls.length && items.length < 2; i++) {
            const el = productEls[i];
            const name = el.querySelector('.css-xrzmfa')?.innerText;
            const link = 'https://www.nykaa.com' + el.querySelector('a')?.getAttribute('href');
            const price = el.querySelector('.css-111z9ua')?.innerText;

            if (name && link) {
                items.push({ name, link, price });
            }
        }

        return items;
    });
    // console.log(products);
    await page.close();
    return products
}

// nykaaScrap('serum for oily skin')
// getProducts()
module.exports = nykaaScrap