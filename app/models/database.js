const dotenv = require('dotenv');
const mongo = require('mongodb');

dotenv.config();

module.exports = class Database {
    constructor(options = {}) {
        this._uri = options.uri || process.env.DB_URI;
        this._databaseName = options.databaseName || 'dragon-read';
    }

    async connect() {
        const uri = this._uri;

        let mongoClient;
        try {
            mongoClient = new mongo.MongoClient(uri);
            await mongoClient.connect();
            return mongoClient;
        } catch (error) {
            console.error('Falha na conexão com o MongoDB', error);
            process.exit();
        }
    }

    async convertObjectId(id) {
        try {
            return new mongo.ObjectId(id);
        } catch (error) {
            console.error('Falha ao converter para ObjectId', error);
            process.exit();
        }
    }

    async close(mongoClient) {
        await mongoClient.close().then(() =>{
            console.log('Conexão Fechada');
        });
    }
}