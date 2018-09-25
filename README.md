# expressjs-simple-rest-api
The simple REST API is based on Express.js. 
* You may want to view [online demo here](http://18.221.231.1:8800/product)
* Download from [Docker Hub](https://hub.docker.com/r/khois/simplerestapi/)
* Using [Insomnia](https://insomnia.rest/) for your test.

|Main dependencies|Versions|
|---|---|
|Express.js|4.16.3|
|Cors|2.8.4|

Supported:
* GET
* POST
* PUT
* DELETE

## Using
* Run `npm i` to install all nedded dependencies.
* Run the command `npm start` or `node index.js` to start your local API server at `http://localhost:8000`.

|Fetch URL|Method|Notes|
|---|---|---|
|`/product`|GET|Get product list (all products)|
|`/product/<id>`|GET|Get a specific product by its ID|
|`/product`|POST|Add a new product|
|`/product/<id>`|PUT|Edit a specific product by its ID|
|`/product/<id>`|DELETE|Delete a specific product by its ID|

* Example for GET method: `http://localhost:8000/product/8`
* Using web browser to view data structure at `http://localhost:8000/product`