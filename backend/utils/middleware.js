const jwt = require("jsonwebtoken");
require("dotenv").config();

const JWT_TOKEN = process.env.JWT_SECRET;

const authUser = (req, res, next) => {
    const authorization = req.headers.authorization;
    if (!authorization || !authorization.startsWith("Bearer ")) {
        return res.status(401).json({ error: "No token provided" });
    } else {
        const token = authorization.split(' ')[1];
        try {
            const decoded = jwt.verify(token, JWT_TOKEN);
            req.userId = decoded.userId;
            next();
        } catch (error) {
            console.error("JWT verification error:", error.message);
            return res.status(403).json({ message: "Invalid token" });
        }
    }
}

module.exports = authUser;
