const jwt = require("jsonwebtoken");

const dotenv = require("dotenv");
dotenv.config();

const userModel = require("../../models/user/user-model.js");
const user = new userModel();

module.exports = class SessionController {
    constructor () {
    }
    
    async getUser (req, res) {
        const token = req.cookies["session_token"];
        
        if (!token) return { user: { logged: false } };

        try{
            const payload = jwt.verify(token, process.env.JWT_KEY);

            const userData = await user.findById(payload.user);
            
            if(!payload?.user || userData == null) {
                res.cookie("session_token", "", { expires: new Date() })
                return { user: { logged: false } };
            }

            return { user: { logged: true, ...userData } };
        } catch (error) {
            console.error('Falha ao buscar dados do usuário', error);

            res.cookie("session_token", "", { expires: new Date() });
            return { user: { logged: false } };
        }   
    }
}