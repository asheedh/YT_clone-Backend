import jwt from "jsonwebtoken"

// a middleware function for checking user is authenticated with valid jwt token
const checkAuth = (req, res, next) => {

    // return if jwt is not there 
    if (!req.headers.authorization || req.headers.authorization.split(" ")[0] !== "JWT" || req.headers.authorization.split(" ")[1] == "") {
        return res.status(403).json({ success: false, message: "jwt token is required" })
    }

    // get token from headers
    const token = req.headers.authorization.split(" ")[1];

    // check token
    try {
        const isTokenValid = jwt.verify(token, process.env.JWT_SECRET);
        req.user = isTokenValid;
    } catch (err) {
        return res.status(403).json({ success: false, message: "Invalid jwt token" })
    }

    next();

}

export default checkAuth;