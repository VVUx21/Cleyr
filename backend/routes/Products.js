const express = require('express');
const app = express.Router();
const { getProducts, getIngredients } = require('../utils/extracter')
const nykaaScrap = require('../scrapers/main')
const puppeteer = require('puppeteer-extra'); // not 'puppeteer'
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

// const vals = getProducts('minimal')
// console.log(vals);
const removeSame = (vals) => {
    const ls = []
    const { productAM, productPM } = vals;
    const lenAM = productAM.length
    const lenPM = productPM.length
    let i = 0;
    let j = 0;
    while (i < lenAM && j < lenPM) {
        if (productAM[i] == productPM[j]) {
            ls.push(productAM[i])
        } else {
            ls.push(productAM[i])
            ls.push(productPM[j])
        }
        i++;
        j++;
    }
    while (i < lenAM) {
        ls.push(productAM[i])
        i++
    }
    while (j < lenPM) {
        ls.push(productPM[j])
        j++
    }
    return ls

}
// const lsFinal = removeSame(vals);
// console.log(lsFinal);

app.post("/commit", (req, res) => {
    const { commitment } = req.body;
    res.json(getProducts(commitment))
})

app.post("/", async (req, res) => {
    const { skinType, skinConcern, commitment, preferredProduct } = req.body;
    if (!commitment || !skinType || !skinConcern) {
        return res.status(400).json({ error: 'Missing required query parameters' });
    }
    const vals = getProducts(commitment);
    const steps = removeSame(vals);
    const ingredients = getIngredients(skinType, skinConcern, commitment);

    if (!steps || !ingredients) {
        return res.status(400).json({ error: 'Missing required query params: steps and ingredients' });
    }
    try {
        console.time("Puppeteer");

        const browser = await puppeteer.launch({
            headless: true,
            defaultViewport: null,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
        
        const results = {};
        for (const step of steps) {
            const query = `${step.trim()} with ${ingredients}`;
            const nykaaRes = await nykaaScrap(browser, query);
            results[step] = { products: step, nykaaRes };
        }

        await browser.close();
        console.timeEnd("Puppeteer");

        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message || 'Something went wrong' });
    }
})
module.exports = app;