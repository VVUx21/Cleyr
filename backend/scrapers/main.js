const puppeteer = require('puppeteer');

const nykaaScrap = async (query) => {
    // Launch the browser and open a new blank page
    const browser = await puppeteer.launch({ headless: false, defaultViewport: null });
    const page = await browser.newPage();

    // Navigate the page to a URL
    await page.goto('https://www.nykaa.com/');

    // Set screen size
    // await page.setViewport({ width: 1080, height: 1024 });

    await page.waitForSelector('input[placeholder="Search on Nykaa"]');
    await page.type('input[placeholder="Search on Nykaa"]', query);

    await page.keyboard.press('Enter');

    await page.waitForSelector('#product-list-wrap .productWrapper');
    // await page.waitForTimeout(7000);
    const products = await page.evaluate(() => {
        const productEls = document.querySelectorAll('#product-list-wrap .productWrapper');
        const items = [];

        for (let i = 0; i < productEls.length && items.length < 20; i++) {
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
    await browser.close();
}

nykaaScrap('serum for oily skin')