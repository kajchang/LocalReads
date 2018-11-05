const express = require('express');
const MongoClient = require('mongodb').MongoClient;
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

(async ()  => {
    await client.connect();
    db = client.db(dbName);
    col = db.collection(colName);
})();

app.post('/create', (req, res) => {
    const title = req.body.title;
    const author = req.body.author;

    if (title === undefined) {
        res.send({result: 'Missing Parameter: Title'});
        return;
    }

    if (author === undefined) {
        res.send({result: 'Missing Parameter: Title'});
        return;
    }

    col.insertOne({
        title: title,
        author: author
    })
        .then(result => {
            res.send({
                result: `Inserted ${result.insertedCount} Documents`
            });
        })
        .catch(err => {
            res.send({
                result: err.toString()
            });
        });
});

app.get('/read', async (req, res) => {
    const title = req.query.title !== undefined ? req.query.title : { $exists: true };
    const author = req.query.author !== undefined ? req.query.author : { $exists: true };

    res.send(await col.find({
        title: title,
        author: author
    }).toArray());
});


app.put('/update', (req, res) => {
    const title = req.body.title;
    const author = req.body.author;

    const newTitle = req.body.newTitle;
    const newAuthor = req.body.newAuthor;

    if (title && newTitle === undefined || newTitle && title === undefined) {
        res.send({result: 'Missing Parameter: Title or New Title'});
        return;
    }

    if (author && newAuthor === undefined || newAuthor && author === undefined) {
        res.send({result: 'Missing Parameter: Author or New Author'});
        return;
    }

    if (title) {
        col.updateMany({
            title: title
        }, {
            $set: {
                title: newTitle
            }
        })
            .then(result => {
                res.send({
                    result: `Modified ${result.modifiedCount} Documents`
                });
            })
            .catch(err => {
                res.send({
                    result: err.toString()
                });
            });
    } else if (author) {
        col.updateMany({
            author: author
        }, {
            $set: {
                author: newAuthor
            }
        })
            .then(result => {
                res.send({
                    result: `Modified ${result.modifiedCount} Documents`
                });
            })
            .catch(err => {
                res.send({
                    result: err.toString()
                });
            });
    }
});

app.delete('/delete', (req, res) => {
    const title = req.body.title !== undefined ? req.body.title : { $exists: true };
    const author = req.body.author !== undefined ? req.body.author : { $exists: true };

    if (req.body.author === undefined && req.body.author === undefined) {
        res.send({
            result: 'Action prevented because it would delete all documents.'
        });
        return;
    }

    col.deleteMany({
        title: title,
        author: author
    })
        .then(result => {
            res.send({
                result: `Deleted ${result.deletedCount} Documents`
            });
        })
        .catch(err => {
            res.send({
                result: err.toString()
            });
        });
});

app.listen(port, () => {
    console.log(`Listening on port ${port}!`);
});
