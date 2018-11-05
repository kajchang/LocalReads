var express = require('express');
var app = express();

app.get('/', (req, res) => {
    res.send('Hello!');
});

app.listen(8080);