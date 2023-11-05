const jwt = require("jsonwebtoken");

const dotenv = require("dotenv");
dotenv.config();

const userModel = require("../models/user/user-model.js");
const user = new userModel();

module.exports = class SessionMiddleware {
    constructor() {

    }

    async privateAccess (req, res, next) {

        const token = req.headers?.authorization;

        if (!token) return res.status(401).send({status: 401, reason: 'Access denied. No token provided.'});

        try{
            const payload = jwt.verify(token, process.env.JWT_KEY);

            const id = await user.findById(payload.user);
            
            if(!payload?.user || id == null) {
                res.status(401).send({status: 401, reason: 'Invalid Token'});
            }

            req.headers['user'] = payload.user;
            return next();
        } catch (error) {
            return res.status(401).send({status: 401, reason: 'Invalid Token'});
        }
    }
}