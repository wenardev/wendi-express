const mongoose = require('mongoose');

mongoose.connect('mongodb://eduwork:password@127.0.0.1:27017?authSource=admin');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', () => console.log('Server database terhubung'));