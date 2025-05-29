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

module.exports = getProducts;