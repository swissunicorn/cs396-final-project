"use strict";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RestaurantSchema = new Schema({
    name: {
        type: Schema.Types.String,
        required: true
    },
    location: {
        type: Schema.Types.String,
        required: true
    },
    tags: [Schema.Types.String],
    price: {
        type: Schema.Types.String
    },
    rating: {
        type: Schema.Types.Number
    }
});
// companion = restaurant
// price will be $, $$, $$$, $$$$
// have sorting options on the page? sort by distance, price, rating

RestaurantSchema.statics.create = function(obj) {
    const Restaurant = mongoose.model("Restaurant", RestaurantSchema);
    const restaurant = new Restaurant();
    restaurant.name = obj.name;
    restaurant.location = obj.location;
    restaurant.tags = obj.tags;
    restaurant.price = obj.price 
    restaurant.rating = obj.rating
    return restaurant;
}

module.exports = mongoose.model("Restaurant", RestaurantSchema);
