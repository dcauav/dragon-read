const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const userModel = require("../../models/user/user-model.js");
const user = new userModel();

module.exports = class AuthController {
    constructor() {
    }

    async hash({ password }) {
        try {
            const salt = await bcrypt.genSalt(10)
            return bcrypt.hash(password, salt);
        } catch (error) {
            console.error('Erro ao criptografar senha - AuthController', error);
        }
    }

    async compareHash({ password, hash }) {
        try {
            return bcrypt.compare(password, hash);
        } catch (error) {
            console.error('Erro ao verificar hash - AuthController', error);
        }
    }

    async verifyToken (req, res, next) {

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

    async register (req, res) {
        const data = req.body;

        if(!(data?.name && data?.nickname && data?.email && data?.phone_number && data?.password)) {
            res.status(401).send({
                status: 401,
                reason: "Informações insuficientes"
            })
        }

        const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

        if(!emailRegexp.test(data.email)) {
            res.status(401).send({
                status: 401,
                reason: "E-mail inválido!"
            });
        }

        if (data.password.length < 8) {
            res.status(401).send({
                status: 401,
                reason: "Senha precisa conter no mínimo 8 caractéres!"
            });
        }
        
        try {
            await user.findOne({ email: data.email }).then((ret) => {
                if(ret != null) {
                    res.status(401).send({
                        status: 401,
                        reason: "Email já cadastrado!"
                    });
                }
            })
        
            const hash = await this.hash({ password : data.password });

            await user.insert({
                name: data.name,
                nickname: data.nickname,
                email: data.email,
                phone_number: data.phone_number,
                password: hash
            });

            res.status(200).send({
                status: 200,
                reason: 'Cadastrado com sucesso!'
            });
        } catch (error) {
            return res.status(401).send({
                status: 401,
                reason: error.message
            })
        }
    }

    async login (req, res) {
        const data = req.body;

        if (!(data?.email && data?.password)) {
            res.status(401).send({
                status: 401,
                reason: "Informações insuficientes"
            })
        } 

        try {    
            const queryResult = await user.findOne({
                email: data.email
            })

            if(queryResult == null) {
                return res.status(401).send({
                    status: 401,
                    reason: 'Email ou senha incorreta, verifique e tente novamente!'
                })
            }

            this.compareHash({
                password: data.password, 
                hash: queryResult.password 
            }).then((ret) => {
                if(!ret) {
                    return res.status(401).send({
                        status: 401,
                        reason: 'Email ou senha incorreta, verifique e tente novamente!'
                    })
                }

                const token = jwt.sign(
                    {user: queryResult._id}, 
                    process.env.JWT_KEY, 
                    {expiresIn: '24h'}
                );
    
                return res.status(200).send({
                    status: 200,
                    data: { user: queryResult._id, token: token }
                })
            })
        } catch (error) {
            return res.status(401).send({
                status: 401,
                reason: error.message
            })
        }     
    }
    
    async logout (req, res) {

    }
}