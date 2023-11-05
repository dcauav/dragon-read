const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const userModel = require("../../models/user/user-model.js");
const user = new userModel();

module.exports = class AuthController {
    constructor() {
    }

    async register (req, res) {
        const data = req.body;

        if(!(data?.name && data?.nickname && data?.email && data?.phone_number && data?.password)) {
            res.status(401).send({
                status: 401,
                message: "Informações insuficientes"
            });
            return res.end();
        }

        const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

        if(!emailRegexp.test(data.email)) {
            res.status(401).send({
                status: 401,
                message: "E-mail inválido!"
            });
            return res.end();
        }

        if (data.password.length < 8) {
            res.status(401).send({
                status: 401,
                message: "Senha precisa conter no mínimo 8 caractéres!"
            });
            return res.end();
        }
        
        try {
            await user.findOne({ email: data.email }).then((ret) => {
                if(ret != null) {
                    res.status(401).send({
                        status: 401,
                        message: "Email já cadastrado!"
                    });
                    return res.end();
                }
            })

            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(data.password, salt);

            await user.insert({
                name: data.name,
                nickname: data.nickname,
                email: data.email,
                phone_number: data.phone_number,
                password: hash
            });

            res.status(200).send({
                status: 200,
                message: 'Cadastrado com sucesso!'
            });
            return res.end();
        } catch (error) {
            res.status(401).send({
                status: 401,
                message: error.message
            });
            return res.end();
        }
    }

    async login (req, res) {
        const data = req.body;

        if (!(data?.email && data?.password)) {
            res.status(401).send({
                status: 401,
                message: "Informações insuficientes"
            });
            return res.end();
        } 

        try {    
            const queryResult = await user.findOne({
                email: data.email
            })

            if(queryResult == null) {
                res.status(401).send({
                    status: 401,
                    message: 'Email ou senha incorreta, verifique e tente novamente!'
                })

                return res.end();
            }

            bcrypt.compare(data.password, queryResult.password).then((ret) => {
                if(!ret) {
                    res.status(401).send({
                        status: 401,
                        message: 'Email ou senha incorreta, verifique e tente novamente!'
                    })

                    return res.end();
                }

                const token = jwt.sign(
                    {user: queryResult._id}, 
                    process.env.JWT_KEY, 
                    {expiresIn: '24h'}
                );
    
                const expires = new Date();
                expires.setTime(expires.getTime() + (7 * 24 * 60 * 60 * 1000));

                res.cookie("session_token", token, {expires: expires});

                res.status(200).send({
                    status: 200,
                    data: { user: queryResult._id }
                });

                return res.end();
            })
        } catch (error) {
            res.status(401).send({
                status: 401,
                message: error.message
            })

            return res.end();
        }     
    }
    
    async logout (req, res) {
        try {
            if (!req.cookies) {
                res.status(401).end()
                return;
            }
    
            const sessionToken = req.cookies["session_token"]

            if (!sessionToken) {
                res.status(401).end()
                return
            }
    
            res.cookie("session_token", "", { expires: new Date() });
            res.redirect('/');
            res.end();
        } catch (error) {
            console.error('Erro ao realizar logout', error);
            res.status(500).end();
        }
    }
}