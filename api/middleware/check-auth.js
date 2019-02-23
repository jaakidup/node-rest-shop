const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {

    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        // Add the decoded token to the request object so we can access it in the route handler
        req.userData = decoded; // choose a good name (req.userDataOrSOMETHING) that isn't already used.
        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Auth failed'
        });
    }

};