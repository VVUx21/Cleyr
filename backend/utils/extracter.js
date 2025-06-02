const XLSX = require('xlsx');
const path = require('path');
const { get } = require('http');

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

const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];

const data = XLSX.utils.sheet_to_json(sheet);
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

module.exports = { getProducts, getIngredients };