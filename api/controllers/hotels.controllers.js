
var mongoose = require ('mongoose');
hotelSchema = require('../data/hotels.model.js');

var Hotel = mongoose.model('hotel', hotelSchema);

var runGeoQuery = function(req, res) {
    var lng = parseFloat(req.query.lng);
    var lat = parseFloat(req.query.lat);

    var point = {
        type : "Point",
        coordinates : [lng, lat]
    };
    
    if (isNaN(lng)  || isNaN(lat)) {
        res
            .status(400)
            .json({
                "Message" : "If supplied in querystring lng and lat must be numbers"
            });
        return;
    }
        
    Hotel
        .aggregate([
        {
            $geoNear: {
                near: point,
                distanceField: "dist.calculated",
                maxDistance: 2000,
                spherical: true
            }
        }])
        .then(function(results, err,){
            console.log('Geo Results', results);
            console.log("Found hotels ", results.length)
            res
                .status(200)
                .json(results)
        })
        .catch(function(err, results){
            console.log('Error finding hotel');
            res
                .status (500)
                .json(err)
        });
};

module.exports.hotelsGetAll = function(req, res) {
        
    var offset = 0;
    var count = 5;
    var maxCount = 10;

    if (req.query && req.query.lat && req.query.lng) {
        runGeoQuery(req, res);
        return;
    };
        
    if (req.query && (req.query.offset)) {
        offset = parseInt(req.query.offset, 10);
    }
    
    if (req.query && (req.query.count)) {
        count = parseInt(req.query.count, 10);
    }

    if (isNaN(offset)  || isNaN(count)) {
        res
            .status(400)
            .json({
                "Message" : "If supplied in querystring count and offset must be numbers"
            });
        return;
    }

    if (count > maxCount) {
        res 
            .status(400)
            .json({
                "message" : "Count limit of " + maxCount + " excedeed"
            });
        return;
    }

    Hotel
        .find()
        .skip(offset)
        .limit(count)
        .exec (function( err, hotels) {
            if (err) {
                console.log("Error finding hotels");
                res
                    .status(500)
                    .json(err);
            } else {
                console.log("Found hotels ", hotels.length);
                res
                    .json(hotels);
            }
        });

};

module.exports.hotelsGetOne = function(req, res) {
    var hotelId = req.params.hotelId;
    console.log("GET hotelId", hotelId);
            
    Hotel
        .findById(hotelId)
        .exec (function (err, doc) {
            var response = {
                status : 200,
                message : doc
            };
            if (err) {
                console.log("Error finding hotel");
                response.status = 500;
                response.message = err;
            } else if (!doc) {
                response.status = 400
                response.message = {
                    "message" : "Hotel ID not found"
                };        
            } 
            res
                .status(response.status)
                .json(response.message);
        });
    };

module.exports.hotelsAddOne = function(req, res) {
        var db = dbconn.get();
        var collection = db.collection('hotels');
        var newHotel;
       
    console.log("POST new hotel");

    if (req.body && req.body.name && req.body.stars) {
        newHotel = req.body
        newHotel.stars = parseInt(req.body.stars, 10);
        collection.insertOne(newHotel, function(err, response) {
            console.log(response);
            console.log(response.ops);
        res
            .status(201)
            .json(response.ops);
        });
    } else {
        console.log("Data missing from body");
        res
        .status(400)
        .json({ message : " Required data missing from body"});
    }

};