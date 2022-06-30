const mongoose = require('mongoose');
const configDB = require('./configDBMongo');

mongoose.connect(configDB.mongoDB.url,configDB.mongoDB.options)

class contMsj {
    constructor(collectionName,docSchema) {
        this.collection = mongoose.model(collectionName,docSchema);
    }
    async save(obj) {
        try {
            return await this.collection.create(obj);
        } catch (error) {
            console.log('Hubo un error al guardar el mensaje',error)
        }
    }
    async getAll() {
        try {
            return await this.collection.find({});
        } catch (error) {
            console.log('Hubo un error al mostrar los mensajes',error)
        }
    }
};

module.exports = contMsj;