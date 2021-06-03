"use strict";

const resetDB = require("../config/scripts/populateDB")

// I'm making doctor restaurant and companion cafe
const Cafe = require("./schema/Cafe");
const Restaurant = require("./schema/Restaurant");

const express = require("express");
const router = express.Router();


// completely resets your database.
// really bad idea irl, but useful for testing
router.route("/reset")
    .get((_req, res) => {
        resetDB(() => {
            res.status(200).send({
                message: "Data has been reset."
            });
        });
    });

router.route("/")
    .get((_req, res) => {
        console.log("GET /");
        res.status(200).send({
            data: "App is running."
        });
    });
    
// ---------------------------------------------------
// Edit below this line
// ---------------------------------------------------


router.route("/restaurants")
    .get((req, res) => {
        console.log("GET /restaurants");
        console.log(req.query)
        if(!req.query.tags) { // no tags
            Restaurant.find({})
            .then(data => {
                res.status(200).send(data);
            })
            .catch(err => {
                res.status(500).send(err);
            });
        }
        else {
            const tag_list = req.query.tags.split(",")
            Restaurant.find({tags: {$all: tag_list}}) // fix it so it has both
            .then(data => {
                res.status(200).send(data);
            })
            .catch(err => {
                res.status(500).send(err);
            })
        }
     })
    .post((req, res) => {
        console.log("POST /restaurants");
        res.status(500).send({
            message: "we don't need to post restaurants lol get out"
        })
    });     

router.route("/cafes")
    .get((req, res) => {
        console.log("GET /cafes");
        if(!req.query.tags) {
            Cafe.find({})
            .then(data => {
                res.status(200).send(data);
            })
            .catch(err => {
                res.status(500).send(err);
            });
        }
        else {
            const tag_list = req.query.tags.split(",")
            Cafe.find({tags: {$all: tag_list}})
            .then(data => {
                res.status(200).send(data);
            })
            .catch(err => {
                res.status(500).send(err);
            })
        }
    })
    .post((req, res) => {
        console.log("POST /cafes");
        res.status(500).send({
            message: "we are not posting to cafes"
        })
    });

module.exports = router;