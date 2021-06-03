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

        // already implemented:
        Restaurant.find({})
            .then(data => {
                res.status(200).send(data);
            })
            .catch(err => {
                res.status(500).send(err);
            });
    })
    .post((req, res) => {
        console.log("POST /restaurants");
        res.status(500).send({
            message: "we don't need to post restaurants lol get out"
        })
    });
    
    // need to modify this so that it's find by tags
router.route("/doctors/:id")
    .get((req, res) => {
        console.log(`GET /doctors/${req.params.id}`);
        Doctor.findById(req.params.id)
            .then(doctor => {
                if (doctor) {
                    res.status(200).send(doctor);
                }
                else {
                    res.status(404).send({
                        message: "id does not exist"
                    })
                }
            })
            .catch(err => {
                res.status(404).send({
                    message: "other error"
                })
            })
    })
           

router.route("/cafes")
    .get((req, res) => {
        console.log("GET /cafes");
        // already implemented:
        Cafe.find({})
            .then(data => {
                res.status(200).send(data);
            })
            .catch(err => {
                res.status(500).send(err);
            });
    })
    .post((req, res) => {
        console.log("POST /cafes");
        res.status(500).send({
            message: "we are not posting to cafes"
        })
    });

// again, edit this so that the tags work
router.route("/companions/:id")
    .get((req, res) => {
        console.log(`GET /companions/${req.params.id}`);
        Companion.findById(req.params.id)
            .then(companion => {
                if (companion) {
                    res.status(200).send(companion);
                }
                else {
                    res.status(404).send({
                        message: "id does not exist"
                    })
                }
            })
            .catch(err => {
                res.status(404).send({
                    message: "other error"
                })
            })
    })

module.exports = router;