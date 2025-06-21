const XLSX = require('xlsx');
const path = require('path');
const normalize = str => str?.toLowerCase().trim() || '';

const filePath2 = path.join(__dirname, '../data/ingredients.xlsx');
const workbook2 = XLSX.readFile(filePath2);
const sheetName2 = workbook2.SheetNames[1];
const sheet2 = workbook2.Sheets[sheetName2];
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

const filePath1 = path.join(__dirname, '../data/data.xlsx');
const workbook1 = XLSX.readFile(filePath1);
function getIngredients(skinType, skinConcerns, commitment) {
    skinType = normalize(skinType);
    skinConcerns = normalize(skinConcerns);
    commitment = normalize(commitment);
    // preferredProduct = normalize(preferredProduct);
    var sheetName = workbook1.SheetNames[0];
    if (skinType == 'oily') {
        sheetName = workbook1.SheetNames[1];
    }
    else if (skinType == 'dry') {
        sheetName = workbook1.SheetNames[2];
    }
    else if (skinType == 'combination') {
        sheetName = workbook1.SheetNames[3];
    }
    else if (skinType == 'sensitive') {
        sheetName = workbook1.SheetNames[4];
    }
    const sheet1 = workbook1.Sheets[sheetName];
    const data1 = XLSX.utils.sheet_to_json(sheet1);
    for (let i = 0; i < data1.length; i++) {
        const element = data1[i];
        const rowConcern = normalize(element['Concern']);
        const rowCommit = normalize(element['Commitment Level'])

        if ((skinConcerns == rowConcern) && (rowCommit == commitment)) {
            return element['Essential Ingredients to Look For']?.split('•').map(i => i.trim()).filter(i => i);
        }
    }

    return [];
}
// console.log(getIngredients('Combination', 'Hydrate Dry Skin', 'Minimal'));


module.exports = { getProducts, getIngredients };