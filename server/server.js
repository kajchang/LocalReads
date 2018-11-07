const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const app = express();

const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

const port = process.env.port ? process.env.port : 8080;

const url = 'mongodb://localhost:27017';
const dbName = 'LocalReads';
const colName = 'books';

const client = new MongoClient(url);
let db, col;

client.connect()
    .then(() => {
        console.log('Connected to MongoDB.');
        db = client.db(dbName);
        col = db.collection(colName);
    })
    .catch(err => {
        console.log(`Error Connecting to MongoDB: ${err.toString()}`);
    });

app.post('/create', (req, res) => {
    const title = req.body.title;
    const author = req.body.author;

    if (!title) {
        res.status(400);
        return res.send({
            result: 'Missing Parameter: title.'
        });
    }

    if (!author) {
        res.status(400);
        return res.send({
            result: 'Missing Parameter: author.'
        });
    }

    col.insertOne({
        title: title,
        author: author
    })
        .then(result => {
            res.send({
                result: `Inserted ${result.insertedCount} Document(s).`
            });
        })
        .catch(err => {
            res.status(500);
            res.send({
                result: err.toString()
            });
        });
});

app.get('/read', async (req, res) => {
    const title = req.query.title ? req.query.title : { $exists: true };
    const author = req.query.author ? req.query.author : { $exists: true };

    res.send(await col.find({
        title: title,
        author: author
    }).toArray());
});


app.put('/update', (req, res) => {
    const _id = req.body._id;

    const newTitle = req.body.newTitle;
    const newAuthor = req.body.newAuthor;

    if (!_id) {
        res.status(400);
        return res.send({
            result: 'Missing Parameter: _id.'
        });
    }

    if (!newTitle && !newAuthor) {
        res.status(400);
        res.send({
            result: 'Missing Parameter: newTitle or newAuthor.'
        });
    }

    if (newTitle && newAuthor) {
        col.updateOne({
            _id: ObjectID(_id)
        }, {
            $set: {
                title: newTitle,
                author: newAuthor
            }
        })
            .then(result => {
                res.send({
                    result: `Modified ${result.modifiedCount} Document(s).`
                });
            })
            .catch(err => {
                res.status(500);
                res.send({
                    result: err.toString()
                });
            });
    } else if (newTitle) {
        col.updateOne({
            _id: ObjectID(_id)
        }, {
            $set: {
                title: newTitle
            }
        })
            .then(result => {
                res.send({
                    result: `Modified ${result.modifiedCount} Document(s).`
                });
            })
            .catch(err => {
                res.status(500);
                res.send({
                    result: err.toString()
                });
            });
    } else if (newAuthor) {
        col.updateOne({
            _id: ObjectID(_id)
        }, {
            $set: {
                author: newAuthor
            }
        })
            .then(result => {
                res.send({
                    result: `Modified ${result.modifiedCount} Document(s).`
                });
            })
            .catch(err => {
                res.status(500);
                res.send({
                    result: err.toString()
                });
            });
    }
});

app.delete('/delete', (req, res) => {
    const _id = req.body._id;

    if (!_id) {
        res.status(400);
        return res.send({
            result: 'Missing Parameter: _id.'
        });
    }

    col.deleteOne({
        _id: ObjectID(_id)
    })
        .then(result => {
            res.send({
                result: `Deleted ${result.deletedCount} Document(s).`
            });
        })
        .catch(err => {
            res.status(500);
            res.send({
                result: err.toString()
            });
        });
});

app.listen(port, () => {
    console.log(`Listening on port ${port}!`);
});
