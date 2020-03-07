var MongoClient = require('mongodb').MongoClient;
var dburl = 'mongodb://localhost:27017/meanhotel';

var _connection = null;

var open = function () {
    MongoClient.connect(dburl, function (err, client) {
        if (err) {
            console.log("DB connection failed");
            return;
        }
        _connection = client.db('meanhotel');
        console.log("Db connection open", client);
    });
};

var get = function () {
    return _connection;
};

module.exports = {
    open : open,
    get : get
};