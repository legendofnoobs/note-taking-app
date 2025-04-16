import pkg from "jsonwebtoken";
import User from "../database/models/userModel.js";

const protect = async (req, res, next) => {
    const { verify } = pkg;
    let token;
    // Get token from header or cookie
    if (req.headers.authorization?.startsWith('Bearer')) {
        token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies?.jwt) {
        token = req.cookies.jwt;
    }

    if (!token) {
        return res.status(401).json({
            message: "Not authorized, no token"
        });
    }

    try {
        const decoded = verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select("-password");

        if (!req.user) {
            return res.status(401).json({
                message: "User not found"
            });
        }

        next();
    } catch (err) {
        res.status(401).json({
            message: "Not authorized, token failed"
        });
    }
};

export default protect;