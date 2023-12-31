const mongodb = require('mongodb')

const getDb = require('../util/database').getDb;

class Product {
    constructor(title, price, imageUrl, description, id, userId) {
        this.title = title;
        this.price = price;
        this.imageUrl = imageUrl;
        this.description = description;
        this._id = id ? new mongodb.ObjectId(id) : null;
        this.userId = userId;
    }

    save() {
        const db = getDb();
        let dbOp;
        if (this._id) {
            dbOp = db.collection('products').updateOne({_id: new mongodb.ObjectId(this._id)}, {$set: this});
        } else {
            dbOp = db.collection('products').insertOne(this);
        }
        return dbOp
        .then(result => {
            console.log(result);
        })
        .catch(err => console.log(err))
    }

    static fetchAll() {
        const db = getDb();
        // find() returns a cursor and not a promise;
        // You can overide this and return a promise by chainign the toArray() method.
        return db.collection('products')
        .find()
        .toArray()
        .then(products => {
            return products;
        })
        .catch(err => console.log(err))
    }

    static findById(productId) {
        const db = getDb();

        return db.collection('products')
        // Mongodb stores id in _id and you need to create a new ObjectId object if querying by ID.
        .find({_id: new mongodb.ObjectId(productId)})
        // next() takes the last item of the returned set, which when looking for one item will be the only one.
        .next()
        .then(product => product)
        .catch(err => console.log(err))
    }

    static deleteById(prodId) {
        const db = getDb();
        return db.collection('products').deleteOne({_id: new mongodb.ObjectId(prodId)})
        .then(result => console.log('Product Deleted!'))
        .catch(err => console.log(err))
    }
}

module.exports = Product;