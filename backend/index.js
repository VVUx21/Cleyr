const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv')
const userRoutes = require('./routes/User');
const productRoutes = require('./routes/Products');
const prefRoute = require('./routes/Preference')
const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());

app.use('/api/user', userRoutes);
app.use("/api/preference", prefRoute)
app.use('/api/products', productRoutes);

app.listen(5000, () => {
    console.log(`Server running on port 5000`);
});

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("MongoDB Connected");
    } catch (err) {
        console.error("MongoDB Connection Error:", err);
        process.exit(1);
    }
};
// connectDB() 
module.exports = app;
