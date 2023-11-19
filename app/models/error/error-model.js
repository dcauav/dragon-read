const database = require('../database.js');
const db = new database();

module.exports = class ErrorModel {
    constructor() {
        this._collection = 'error-log'
    }

    async insert(data = {
        processName: "process name",
        errorMessage: "error reason message"
    }) {
        var conn;

        try {
            await db.connect().then((res) => {
                conn = res;
            });

            const collection = conn.db(db._databaseName).collection(this._collection);

            return await collection.insertOne({
                processName: data.processName,
                errorMessage: data.errorMessage,
                registryDate: Date.now()
            });
        } catch (error) {
            console.error('Erro ao realizar inclusão - errorModel', error);
        } finally {
            db.close(conn);
        }
    }

    async findAll() {
        const conn = await db.connect();

        try {
            const collection = conn.db(db._databaseName).collection(this._collection);

            return await collection.find().toArray();
        } catch (error) {
            console.error('Erro ao realizar consulta geral - errorModel', error);
        } finally {
            db.close(conn);
        }
    }
}