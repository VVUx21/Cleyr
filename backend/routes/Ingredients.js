const express = require('express');
const app = express.Router();
const { getIngredients } = require('../utils/extracter')
app.post("/suggest", (req, res) => {
    const { skinType, skinConcern, commitment, preferredProduct } = req.body;
    res.json({ ingredients: getIngredients(skinType, skinConcern, commitment, preferredProduct) })
})
module.exports = app;