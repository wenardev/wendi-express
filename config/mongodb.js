const {MongoClient} = require('mongodb');

const url = 'mongodb://eduwork:password@127.0.0.1:27017?authSource=admin';
const client = new MongoClient(url);

(async () => {
    try {
        await client.connect();
        console.log('Koneksi ke mongodb berhasil');
    }catch(e) {
        console.log(e)
    }
})();

const db = client.db('eduwork-native');

module.exports = db;