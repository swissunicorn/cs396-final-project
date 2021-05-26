"use strict";

const Restaurant = require("../../src/schema/Restaurant"); // doctor
const Cafe = require("../../src/schema/Cafe"); // companion
const data = require("../data.json");
require("dotenv").config();
// how to re-link something to github?

const env = "" + process.env.NODE_ENV;

const configObj = require("../config");
const config = configObj[env || "development"];
const mongoose = require("mongoose");


const populate = (callback) => {
    // console.log("Trying to connect to database...");
    mongoose.connect(config.database, config.mongoConfig, err => {
        if (err) {
            console.log("Could not connect to database.");
        }
        // console.log("Clearing database...");
        const schemas = [ Restaurant, Cafe ];
        Promise
            .all(
                // first delete any data that currently exists:
                schemas.map(schema => schema.deleteMany())
            )
            .then(() => {
                return Restaurant.insertMany(data.restaurants); // data.restaurants!
            })
            .then(() => {
                return Cafe.insertMany(data.cafes);
            })
            .catch(err => {
                console.log(err);
                process.exit(1);
            })
            .finally(() => {
                // console.log("Database populated successfully.");
                if (callback) {
                    callback();
                } else {
                    console.log('Exiting');
                    process.exit(0);
                }
            });
    });
};

module.exports = populate;
