const express = require('express');
const app = express.Router();
const XLSX = require('xlsx');
const path = require('path');

const filePath = path.join(__dirname, '../data/ingredients.xlsx');
const workbook = XLSX.readFile(filePath);

const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];

const data = XLSX.utils.sheet_to_json(sheet);

const normalize = str => str?.toLowerCase().trim() || '';
function getIngredients(skinType, skinConcern, commitment, preferredProduct) {
    skinType = normalize(skinType);
    skinConcern = normalize(skinConcern);
    commitment = normalize(commitment);
    preferredProduct = normalize(preferredProduct);

    for (let i = 0; i < data.length; i++) {
        const element = data[i];

        const rowSkinType = normalize(element['Skin type']);
        const rowConcern = normalize(element['Skin Concern']);
        const rowProductPref = normalize(element['Preferred Skincare Ingredients/Products']);
        const rowCommit = normalize(element['Skincare Routine Commitment Level'])

        if ((rowSkinType == skinType) && (rowConcern == skinConcern) && (rowCommit == commitment) && (rowProductPref == preferredProduct)) {
            return element['Essential Ingredients to Look For']?.split('•').map(i => i.trim()).filter(i => i);
        }
    }

    return [];
}
// console.log(getIngredients('Normal', 'Reduce Redness & Sensitivity', 'Minimal', 'Natural/Organic Products'))

app.post("/suggest", (req, res) => {
    const { skinType, skinConcern, commitment, preferredProduct } = req.body;
    res.json({ ingredients: getIngredients(skinType, skinConcern, commitment, preferredProduct) })
})
module.exports = app;