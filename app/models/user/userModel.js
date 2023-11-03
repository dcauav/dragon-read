const database = require('../database.js');
const db = new database();

'use strict';

module.exports = class userModel {
    constructor() {
        this._collection = 'users';
    }

    async insert(data = {
        name: "name",
        nickname: "nickname",
        email: "email",
        phone_number: "phone_number",
        password: "password"
    }) {
        var conn;

        try {
            await db.connect().then((res) => {
                conn = res;
            });

            let collection = conn.db(db._databaseName).collection(this._collection);

            let dataObject = {
                name: data.name,
                nickname: data.nickname,
                email: data.email,
                password: data.password,
                phone_number: data.phone_number || "",
                medals: [],
                city: "",
                state: "",
                registryDate: Date.now()
            };

            return await collection.insertOne(dataObject);
        } catch (error) {
            console.error('Erro ao incluir dados - userModel', error);
        } finally {
            db.close(conn);
        }
    }

    async update({ id }, data = {
        name: "name",
        nickname: "nickname",
        phone_number: "phone_number",
        city: "",
        state: ""
    }) {
        const conn = await db.connect();

        try {
            let collection = conn.db(db._databaseName).collection(this._collection);

            let dataObject = {
                $set: {
                    name: data.name,
                    nickname: data.nickname,
                    phone_number: data.phone_number,
                    city: data.city,
                    state: data.state
                }
            }

            return await collection.updateOne({ _id: id }, dataObject, function (err, res) {
                if (err) { throw err };
                return res;
            })
        } catch (error) {
            console.error('Erro ao atualizar dados - userModel', error);
        } finally {
            db.close(conn);
        }
    }

    async delete({ id }) {
        const conn = await db.connect();

        try {
            let collection = conn.db(db._databaseName).collection(this._collection);

            return await collection.deleteOne({ _id: id });
        } catch (error) {
            console.error('Erro ao excluir dados - userModel', error)
        } finally {
            db.close(conn);
        }
    }

    async findById(id) {
        const conn = await db.connect();
        
        try {
            const objectId = await db.convertObjectId(id);
            let collection = conn.db(db._databaseName).collection(this._collection);
            
            return await collection.findOne({
                _id: objectId
            });
        } catch (error) {
            console.error('Erro ao realizar consulta única - userModel', error);
        } finally {
            db.close(conn);
        }
    }

    async findOne(query) {
        const conn = await db.connect();

        try {
            let collection = conn.db(db._databaseName).collection(this._collection);
            
            return await collection.findOne(query);
        } catch (error) {
            console.error('Erro ao realizar consulta única - userModel', error);
        } finally {
            db.close(conn);
        }
    }

    async findAll({ query }) {
        const conn = await db.connect();

        try {
            let collection = conn.db(db._databaseName).collection(this._collection);

            return await collection.find(query).toArray();
        } catch (error) {
            console.error('Erro ao realizar consulta geral - userModel', error);
        } finally {
            db.close(conn);
        }
    }
}