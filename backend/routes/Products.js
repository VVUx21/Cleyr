const express = require('express');
const app = express.Router();
const getProducts = require('../utils/getProducts')
const nykaaScrap = require('../scrapers/main')

const formQuery = async (products, ingredients) => {
    const query = `${products} with ${ingredients}`
    const nykaaRes = await nykaaScrap(query)

    return { products, nykaaRes };
};
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

app.post("/", (req, res) => {
    const { commitment } = req.body;
    res.json(getProducts(commitment))
})

app.get("/", async (req, res) => {
    const { commitment } = req.body;
    const vals = getProducts(commitment)
    const steps = removeSame(vals);
    console.log(steps);
    // const steps = ['Cleanser', 'Moisturizer']; // based on commitment
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