const express = require('express');
const app = express.Router();
const { getProducts, getIngredients } = require('../utils/extracter')
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
    const { skinType, skinConcern, commitment, preferredProduct } = req.body;
    if (!commitment || !skinType || !skinConcern) {
        return res.status(400).json({ error: 'Missing required query parameters' });
    }
    const vals = getProducts(commitment)
    const steps = removeSame(vals);
    const ingredients = getIngredients(skinType, skinConcern, commitment, preferredProduct)

    if (!steps || !ingredients) {
        return res.status(400).json({ error: 'Missing required query params: steps and ingredients' });
    }
    try {
        const queries = steps.map(step => formQuery(step.trim(), ingredients));
        const results = await Promise.all(queries);

        const resultObj = {};
        steps.forEach((step, i) => {
            resultObj[step] = results[i];
        });

        res.json(resultObj);
    } catch (err) {
        res.status(500).json({ error: 'Error querying Nykaa' });
    }
})
module.exports = app;