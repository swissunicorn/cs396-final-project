"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// name
// location
// tags
// price
// rating

// ideas for tags: outdoor seating, open late
// allow the user to select whether they want to see things that are open now
const CafeSchema = new Schema({
    name: {
        type: Schema.Types.String,
        required: true
    },
    location: {
        type: Schema.Types.String,
        required: true
    },
    tags: {
        type: [Schema.Types.String],
        required: true
    },
    price: {
        type: Schema.Types.String
    },
    rating: {
        type: Schema.Types.Number
    }
});

CafeSchema.statics.create = function(obj) {
    const Cafe = mongoose.model("Cafe", CafeSchema);
    const cafe = new Cafe();
    cafe.name = obj.name;
    cafe.location = obj.location;
    cafe.tags = obj.tags;
    cafe.price = obj.price;
    cafe.rating = obj.rating;
    return cafe;
}

module.exports = mongoose.model("Cafe", CafeSchema);
