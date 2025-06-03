const express = require('express');
const prisma = require('../utils/prisma');
const auth = require('../utils/middleware');
const { getIngredients } = require('../utils/extracter');

const app = express.Router();

app.get('/', auth, async (req, res) => {
    const {
        skinType,
        skinConcerns,
        commitment,
        preferredProduct
    } = req.body;

    const preferredIngredients = getIngredients(skinType, skinConcerns, commitment, preferredProduct)
    // console.log(preferredIngredients);
    try {
        const pref = await prisma.userPreferences.upsert({
            where: { userId: req.userId },
            update: {
                skinType,
                skinConcerns,
                commitment,
                preferredProduct,
                preferredIngredients,
            },
            create: {
                userId: req.userId,
                skinType,
                skinConcerns,
                commitment,
                preferredProduct,
                preferredIngredients,
            },
        });

        res.json(pref);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Failed to save preferences' });
    }
});

module.exports = app;
