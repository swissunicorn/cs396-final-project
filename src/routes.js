"use strict";

const resetDB = require("../config/scripts/populateDB")

const Companion = require("./schema/Companion");
const Doctor = require("./schema/Doctor");

const express = require("express");
const FavoriteDoctor = require("./schema/FavoriteDoctor");
const FavoriteCompanion = require("./schema/FavoriteCompanion");
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
router.route("/doctors")
    .get((req, res) => {
        console.log("GET /doctors");

        // already implemented:
        Doctor.find({})
            .then(data => {
                res.status(200).send(data);
            })
            .catch(err => {
                res.status(500).send(err);
            });
    })
    .post((req, res) => {
        console.log("POST /doctors");
        if (!req.body.name || !req.body.seasons) {
            res.status(500).send({
                message: "missing data"
            });
            return;
        }
        Doctor.create(req.body)
            .save()
            .then(doctor => {
                res.status(201).send(doctor);
            })
    });
    
    //works
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
    .patch((req, res) => {
        console.log(`PATCH /doctors/${req.params.id}`);
        Doctor.findOneAndUpdate(
            {_id: req.params.id },
            req.body,
            { new: true }
        )
        .then(doctor => {
            if(doctor) {
                res.status(200).send(doctor);
            }
            else {
                res.status(404).send({
                    message: "id does not exist"
                })
            }
        })
    })
    .delete((req, res) => {
        console.log(`DELETE /doctors/${req.params.id}`);
        Doctor.findOneAndDelete({_id: req.params.id})
            .then(doctor => {
                if(doctor) {
                    res.status(200).send(null);
                }
                else {
                    res.status(404).send({
                        message: "id does not exist"
                    });
                }
            })
    });
           

router.route("/companions")
    .get((req, res) => {
        console.log("GET /companions");
        // already implemented:
        Companion.find({})
            .then(data => {
                res.status(200).send(data);
            })
            .catch(err => {
                res.status(500).send(err);
            });
    })
    .post((req, res) => {
        console.log("POST /companions");
        if (!req.body.name || !req.body.character || !req.body.alive) { // are these the only required attributes?
            res.status(500).send({
                message: "missing data"
            });
            return;
        }
        Companion.create(req.body)
            .save()
            .then(companion => {
                res.status(201).send(companion);
            })
    });

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
    .patch((req, res) => {
        console.log(`PATCH /companions/${req.params.id}`);
        Companion.findOneAndUpdate(
            {_id: req.params.id },
            req.body,
            { new: true }
        )
        .then(companion => {
            if(companion) {
                res.status(200).send(companion);
            }
            else {
                res.status(404).send({
                    message: "id does not exist"
                })
            }
        })
    })
    .delete((req, res) => {
        console.log(`DELETE /companions/${req.params.id}`);
        Companion.findOneAndDelete({_id: req.params.id})
            .then(companion => {
                if (companion) {
                    res.status(200).send(null);
                }
                else {
                    res.status(404).send({
                        message: "invalid id"
                    })
                }
            })
    });

module.exports = router;