const express = require('express');
const path = require('path');
const cors = require('cors');

const config = require('./config.js');
const database = require('./database');
const header = require('./header');

const serverConfig = config.serverConfig;

const app = express();

// Resource
const productList = database.productList;

// Resource lookup
function lookupProduct(req, res, next){
    const productId = parseInt(req.params.id);
    let result = [];

    const findItemIndex = productList.findIndex(item => item.id === productId);
    if (findItemIndex >= 0){
        result = [...result, productList[findItemIndex]];
        res.status(200);
    } else {
        res.status(404);
    }
    
    return res.set(header.getHeader)
                .json(result)
}

// Router
const productRouter = express.Router();
productRouter.use(express.json()); // Using for POST - Getting body.data

productRouter.get('/', (req, res) => { 
    res.set(header.getHeader)
        .status(200)
        .json(productList)
});
productRouter.get('/:id', lookupProduct, (req, res) => { });
productRouter.post('/', (req, res) => {
    let result = {};
    const findItemIndex = productList.findIndex(item => item.id === req.body.id);
    if (findItemIndex === -1){
        res.status(201);
        result = Object.assign({}, {...req.body, status: 'added'});
    } else {
        res.status(400);
    }

    res.set(header.changeDataHeader)
        .json(result);
});
productRouter.put('/:id', (req, res) => {
    const productId = parseInt(req.params.id) || 0;
    let result = {};
    if (productId > 0) {
        const findItemIndex = productList.findIndex(item => item.id === productId);
        if (findItemIndex !== -1){
            res.status(200); // Updated successfull
            result = Object.assign({}, {...req.body, id: productId, status: 'edited'});
        } else {
            res.status(400); // Bad request
        }
    } else {
        res.status(400);
    }

    res.set(header.changeDataHeader)
        .json(result);
});
productRouter.delete('/:id', (req, res) => {
    const productId = parseInt(req.params.id) || 0;
    let result = {};
    let findItemIndex = -1;

    if (productId > 0) {
        findItemIndex = productList.findIndex(item => item.id === productId);
        if (findItemIndex !== -1){
            res.status(200); // Deleted successfull
            result = Object.assign({}, {...productList[findItemIndex], status: 'deleted'});
        } else {
            res.status(400); // Bad request
        }
    } else {
        res.status(400); // Bad request
    }

    res.set(header.changeDataHeader)
        .json(result);
});

// -------------- App --------------------------
app.use(cors()); // Using CORS

app.use('/product', productRouter);
app.use(express.static(__dirname + serverConfig.rootDir));
app.use(function (req, res, next) { // Handle responsed headers
    res.set(header.defaultHeader);
    next();
});

app.get('*', function (req, res) {
    res.set(header.defaultHeader);
    res.statusCode = 200;
    res.sendFile(path.join(__dirname + serverConfig.rootDir,  
                            serverConfig.defaultPage));
    res.end();
});

app.listen(serverConfig.port, () => {
    console.log(`Express server is listening on port ${serverConfig.port}!`);
    console.log(`View your localhost at\x1b[36m http://localhost:${serverConfig.port}\x1b[0m`)
});

