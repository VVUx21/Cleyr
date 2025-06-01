const express = require('express');
const app = express.Router();
const getProducts = require('../utils/getProducts')
const nykaaScrap = require('../scrapers/main')

const formQuery = async (products, ingredients) => {
    const query = `${products} with ${ingredients}`
    const nykaaRes = await nykaaScrap(query)

    return { products, nykaaRes };
};

app.post("/", (req, res) => {
    const { commitment } = req.body;
    res.json(getProducts(commitment))
})

app.get("/", async (req, res) => {
    // const { steps, ingredients } = req.query;
    const steps = ['Cleanser', 'Moisturizer']; // based on commitment
    const ingredients = ['Niacinamide', 'Ceramides']; // from your API

    if (!steps || !ingredients) {
        return res.status(400).json({ error: 'Missing required query params: steps and ingredients' });
    }
    const result = {};

    for (const step of steps) {
        result[step] = await formQuery(step.trim(), ingredients);
    }

    res.json(result);
})
module.exports = app;