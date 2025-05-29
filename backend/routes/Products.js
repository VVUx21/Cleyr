const express = require('express');
const app = express.Router();
const getProducts = require('../utils/getProducts')
// console.log(getProducts('minimal'))
app.post("/", (req, res) => {
    const { commitment } = req.body;
    res.json(getProducts(commitment))
})
module.exports = app;