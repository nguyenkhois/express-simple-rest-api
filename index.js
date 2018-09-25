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
        res.statusCode = 200;
    } else {
        res.statusCode = 404;
    }
    
    res.set(header.getHeader);
    return res.json(result)
}

// Router
const productRouter = express.Router();
productRouter.use(express.json()); // Using for POST - Getting body.data
productRouter.get('/', function(req, res){ 
    res.set(header.getHeader);
    res.statusCode = 200;
    res.json(productList)
});
productRouter.get('/:id', lookupProduct, function(req, res){ });
productRouter.post('/', (req, res) => {
    const findItemIndex = productList.findIndex(item => item.id === req.body.id);
    if (findItemIndex === -1){
        res.statusCode = 201;
    } else {
        res.statusCode = 400;
    }

    res.set(header.changeDataHeader);

    // Return result
    if (res.statusCode === 201){
        return res.json(req.body)
    } else {
        return res.json({})
    }
});
productRouter.put('/', (req, res) => {
    const productId = parseInt(req.body.id) || 0;
    if (productId > 0) {
        const findItemIndex = productList.findIndex(item => item.id === productId);
        if (findItemIndex !== -1){
            res.statusCode = 200; // Updated successfull
        } else {
            res.statusCode = 400; // Bad request
        }
    } else {
        res.statusCode = 400; // Bad request
    }

    res.set(header.changeDataHeader);

    // Return result
    if (res.statusCode === 200){
        return res.json(req.body)
    } else {
        return res.json({})
    }
});
productRouter.delete('/:id', (req, res) => {
    const productId = parseInt(req.params.id) || 0;
    let findItemIndex = -1;

    if (productId > 0) {
        findItemIndex = productList.findIndex(item => item.id === productId);
        if (findItemIndex !== -1){
            res.statusCode = 200; // Deleted successfull
        } else {
            res.statusCode = 400; // Bad request
        }
    } else {
        res.statusCode = 400; // Bad request
    }

    res.set(header.changeDataHeader);

    // Return result
    if (res.statusCode === 200){
        return res.json(productList[findItemIndex])
    } else {
        return res.json({})
    }
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

