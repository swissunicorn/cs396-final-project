"use strict";

const resetDB = require("../config/scripts/populateDB")
const fetch = require("node-fetch");

// I'm making doctor restaurant and companion cafe
const Cafe = require("./schema/Cafe");
const Restaurant = require("./schema/Restaurant");

const express = require("express");
const router = express.Router();

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
            Restaurant.find({tags: {$all: tag_list}})
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

router.route("/distance")
    .get((req, res) => {
        let origin = req.query.origin;
        let dest = req.query.destination;
        let url = "https://maps.googleapis.com/maps/api/distancematrix/json?origins=" + origin + "&destinations=" + dest + `&key=${process.env.API_KEY}` + "&units=imperial";
        fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log(rows)
            console.log(rows[0])
            console.log(rows[0][0].text)
            res.status(200).send(data);
        })
        .catch(err => {
            res.status(404).send({
                message: "you screwed up"
            })
        })
    })

module.exports = router;