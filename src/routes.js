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

// can I just make it so I pass something in the req.body?
router.route("/restaurants")
    .get((req, res) => {
        console.log("GET /restaurants");
        console.log(req.body)
        if(!req.body) { // no tags
            Restaurant.find({})
            .then(data => {
                res.status(200).send(data);
            })
            .catch(err => {
                res.status(500).send(err);
            });
        }
        else {
            Restaurant.find({tags: req.body.tags})
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
        if(!req.body) {
            Cafe.find({})
            .then(data => {
                res.status(200).send(data);
            })
            .catch(err => {
                res.status(500).send(err);
            });
        }
        else {
            Cafe.find({tags: req.body.tags})
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