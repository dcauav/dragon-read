const errorModel = require("../error/error-model.js");
const log = new errorModel();

const database = require('../database.js');
const db = new database();

module.exports = class UserModel {
    constructor() {
        this._collection = 'users';
    }

    async insert(data = {
        name: "name",
        nickname: "nickname",
        email: "email",
        phoneNumber: "phoneNumber",
        password: "password"
    }) {
        var conn;

        try {
            await db.connect().then((res) => {
                conn = res;
            });

            const collection = conn.db(db._databaseName).collection(this._collection);

            return await collection.insertOne({
                name: data.name,
                nickname: data.nickname,
                email: data.email,
                password: data.password,
                phoneNumber: data.phoneNumber || "",
                medals: [],
                city: "",
                state: "",
                registryDate: Date.now()
            });
        } catch (error) {
            log.insert({processName: 'UserModel.insert()', errorMessage: error.message});
        } finally {
            db.close(conn);
        }
    }

    async update({ id }, data = {
        name: "name",
        nickname: "nickname",
        phoneNumber: "phoneNumber",
        city: "",
        state: ""
    }) {
        const conn = await db.connect();

        try {
            const collection = conn.db(db._databaseName).collection(this._collection);

            return await collection.updateOne({ _id: id }, {
                $set: {
                    name: data.name,
                    nickname: data.nickname,
                    phoneNumber: data.phoneNumber,
                    city: data.city,
                    state: data.state
                }
            }, function (err, res) {
                if (err) { throw err };
                return res;
            })
        } catch (error) {
            log.insert({processName: 'UserModel.update()', errorMessage: error.message});
        } finally {
            db.close(conn);
        }
    }

    async delete({ id }) {
        const conn = await db.connect();

        try {
            const collection = conn.db(db._databaseName).collection(this._collection);

            return await collection.deleteOne({ _id: id });
        } catch (error) {
            log.insert({processName: 'UserModel.delete()', errorMessage: error.message});
        } finally {
            db.close(conn);
        }
    }

    async findById(id) {
        const conn = await db.connect();
        
        try {
            const objectId = await db.convertObjectId(id);
            const collection = conn.db(db._databaseName).collection(this._collection);
            
            return await collection.findOne({
                _id: objectId
            });
        } catch (error) {
            log.insert({processName: 'UserModel.findById()', errorMessage: error.message});
        } finally {
            db.close(conn);
        }
    }

    async findOne(query) {
        const conn = await db.connect();

        try {
            const collection = conn.db(db._databaseName).collection(this._collection);
            
            return await collection.findOne(query);
        } catch (error) {
            log.insert({processName: 'UserModel.findOne()', errorMessage: error.message});
        } finally {
            db.close(conn);
        }
    }

    async findAll({ query }) {
        const conn = await db.connect();

        try {
            const collection = conn.db(db._databaseName).collection(this._collection);

            return await collection.find(query).toArray();
        } catch (error) {
            log.insert({processName: 'UserModel.findAll()', errorMessage: error.message});
        } finally {
            db.close(conn);
        }
    }
}