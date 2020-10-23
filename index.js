'use strict'

const express = require('express');
const morgan = require('morgan');
const http = require('http');
const app = express();
const keys = require('./keys');
const bodyParser = require('body-parser');
const routes = require('./routes');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

app.use('/api', routes)

const server = http.createServer(app);

server.listen(keys.port, (err, res) => {
    if (err) {
        throw err;
    } else {
        console.log('Server running on port', keys.port);
    }
})