// import puppeteer from 'puppeteer';

// (async () => {
//     // Launch the browser and open a new blank page
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();

//     // Navigate the page to a URL
//     await page.goto('https://www.nykaa.com/');

//     // Set screen size
//     await page.setViewport({ width: 1080, height: 1024 });

//     await page.waitForSelector('input[placeholder="Search for Products, Brands and More"]');
//     await page.type('input[placeholder="Search for Products, Brands and More"]', 'serum for dry skin');

//     await page.keyboard.press('Enter');

//     // Locate the full title with a unique string
//     const textSelector = await page.waitForSelector(
//         'text/Customize and automate',
//     );
//     const fullTitle = await textSelector?.evaluate(el => el.textContent);

//     // Print the full title
//     console.log('The title of this blog post is "%s".', fullTitle);

//     await browser.close();
// })();

const express = require('express');
const app = express.Router();
const XLSX = require('xlsx');
const path = require('path');

const filePath = path.join(__dirname, '../data/ingredients.xlsx');
const workbook = XLSX.readFile(filePath);
const normalize = str => str?.toLowerCase().trim() || '';
//Extracting products based on commitment
const sheetName2 = workbook.SheetNames[1];
const sheet2 = workbook.Sheets[sheetName2];

const data2 = XLSX.utils.sheet_to_json(sheet2);

function getProducts(commitment) {
    var productAM = [];
    var productPM = [];
    commitment = normalize(commitment);
    for (let i = 0; i < data2.length; i++) {
        const element = data2[i];
        const rowCommit = normalize(element['Commitment Level']);
        if (commitment == rowCommit) {
            productAM = element['Product Suggestion AM']?.split('•').map(i => i.trim()).filter(i => i);
            productPM = element['Product Suggestion PM']?.split('•').map(i => i.trim()).filter(i => i);
            break
        }
    }

    return { productAM, productPM };
}
// console.log(getProducts('Intensive'))

app.post("/", (req, res) => {
    const { commitment } = req.body;
    res.json(getProducts(commitment))
})
module.exports = app;