const { ObjectId } = require('bson');
const db = require('../../config/mongodb');
const fs = require('fs');
const path = require('path');

const index = (req, res) => {
    db.collection('products')
        .find()
        .toArray()
        .then(result => res.send(result))
        .catch(error => res.send(error));
}

const view = (req, res) => {
    const { id } = req.params;
    db.collection('products')
        .findOne({ _id: new ObjectId(id) })
        .then(result => res.send(result))
        .catch(error => res.send(error));
}

const store = (req, res) => {
    const { name, price, stock, status } = req.body;
    const image = req.file;
    if (image) {
        const target = path.join(__dirname, '../../uploads', image.originalname);
        fs.renameSync(image.path, target);
        const imageUrl = `http://localhost:3000/public/${image.originalname}`;
        db.collection('products')
            .insertOne({ name, price, stock, status, image_url: imageUrl })
            .then(result => res.send(result))
            .catch(error => res.send(error));
    } else {
        res.status(400).json({ message: 'No image file provided' });
    }
}

const update = (req, res) => {
    const { id } = req.params;
    const { name, price, stock, status } = req.body;
    const image = req.file;
    if (image) {
        const target = path.join(__dirname, '../../uploads', image.originalname);
        fs.renameSync(image.path, target);
        const imageUrl = `http://localhost:3000/public/${image.originalname}`;
        db.collection('products')
            .updateOne(
                { _id: new ObjectId(id) },
                { $set: { name, price, stock, status, image_url: imageUrl } }
            )
            .then(result => res.send(result))
            .catch(error => res.send(error));
    } else {
        db.collection('products')
            .updateOne(
                { _id: new ObjectId(id) },
                { $set: { name, price, stock, status } }
            )
            .then(result => res.send(result))
            .catch(error => res.send(error));
    }
}

const destroy = (req, res) => {
    const { id } = req.params;
    db.collection('products')
        .deleteOne({ _id: new ObjectId(id) })
        .then(result => res.send(result))
        .catch(error => res.send(error));
}

module.exports = {
    index,
    view,
    store,
    update,
    destroy
};
