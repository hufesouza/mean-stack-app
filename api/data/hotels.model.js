var mongoose = require('mongoose');
var Schema = mongoose.Schema;

reviewSchema = new Schema({
    name : {
        type : String,
        required : true
    },
    rating : {
        type : Number,
        min : 0,
        max : 5,
        required : true
    },
    review : {
        type : String,
        required : true
    },
    createdOn : {
        type : Date,
        "default" : Date.now
    }
});

var roomSchema = new Schema ({
    Type : String,
    number : Number,
    description : String,
    photos : [String],
    price : Number
});

var hotelSchema = new Schema({
    name : {
        type : String,
        required : true
    },
    stars : {
        type : Number,
        min : 0,
        max : 5,
        "default" : 0
    },
    service : [String],
    description : String,
    photos : [String],
    currency : String,
    reviews : [reviewSchema],
    rooms : [roomSchema],
    location : {
        address : String,
        // Always store coordinates longitude (E/W), latitude (N/S)
        coordinates : {
            type : [Number],
            index : '2dsphere'
        }
    }
});

mongoose.model('Hotel', hotelSchema);

