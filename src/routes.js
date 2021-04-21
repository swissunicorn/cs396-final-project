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

// optional:
router.route("/doctors/favorites")
    .get((req, res) => {
        console.log(`GET /doctors/favorites`);
        FavoriteDoctor.find({})
            .then(fav_ids => {
                return FavoriteDoctor.getDoctors(fav_ids);
            })
            .then(doc_objects => {
                res.status(200).send(doc_objects);
            })
            .catch(err => {
                res.status(404).send({
                    message: "oops"
                })
            })
    })
    .post((req, res) => {
        console.log(`POST /doctors/favorites`);
        FavoriteDoctor.create(req.params.id)
            .save()
            .then(favdoc => {
                res.status(200).send(favdoc)
            })
            .catch(err => {
                message: "some error"
            })
        // Doctor.findById(req.params.id)
        //     .catch(err => {
        //         message: "bad id"
        //     })
        // FavoriteDoctor.findById(req.params.id)
        //     .then(doctor => {
        //         if (doctor) {
        //             res.status(500).send({
        //                 message: "this doctor is already a favorite"
        //             })
        //         }
        //         else {
        //             FavoriteDoctor.create(req.params.id)
        //             .save()
        //             .then(fav_doc => {
        //                 console.log(fav_doc)
        //                 res.status(200).send(fav_doc);
        //             })
        //             .catch(err => {
        //                 res.status(500).send({
        //                     message: "doc creation error"
        //                 })
        //             })
        //         }
        //     })
        //     .catch(nodoctor => {
        //         res.status(500).send({
        //             message: "some other error"
        //         })
        //     })

        // Doctor.findById(req.params.id)
        //     .then(doctor => {
        //         FavoriteDoctor.create(doctor._id)
        //             .save()
        //             .then(fav_doc => {
        //                 console.log(fav_doc)
        //                 res.status(200).send(fav_doc);
        //             })
        //     })

            
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
    
router.route("/doctors/:id/companions")
    .get((req, res) => {
        console.log(`GET /doctors/${req.params.id}/companions`);
        Companion.find({"doctors": {'$in': req.params.id}})
            .then(companions => {
                res.status(200).send(companions);    
            })
            .catch(err => {
                    res.status(404).send({
                        message: "invalid id"
                    })
                })
    });
    

router.route("/doctors/:id/goodparent")
    .get((req, res) => {
        console.log(`GET /doctors/${req.params.id}/goodparent`);
        Companion.find({"doctors": {'$eq' : req.params.id}, "alive": true})
            .then(live_companions => {
                Companion.find({"doctors": req.params.id})
                    .then(companions => {
                        res.status(200).send(live_companions.length == companions.length);
                    })
                    .catch(err => {
                        res.status(404).send({
                            message: "some other error"
                        })
                    });
            }) 
            .catch(err => {
                res.status(404).send({
                    message: "invalid id"
                    })
                })
            });               

// optional:
router.route("/doctors/favorites/:doctor_id")
    .delete((req, res) => {
        console.log(`DELETE /doctors/favorites/${req.params.doctor_id}`);
        FavoriteDoctor.findOneAndDelete(req.params.id)
            .then(doc => {
                res.status(200).send(null);
            })
            .catch(err => {
                res.status(500).send({
                    message: "id error"
                })
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

    // works??
router.route("/companions/crossover")
    .get((req, res) => {
        console.log(`GET /companions/crossover`);
        Companion.find({"doctors": {'$not': {'$size': 1}}})
            .then(companions => {
                res.status(200).send(companions);
            })
            .catch(err => {
                res.status(404).send({
                    message: "invalid id"
                })
            })
        // list of companions whose doctors arrays are greater than one
    });

// optional:
router.route("/companions/favorites")
    .get((req, res) => {
        console.log(`GET /companions/favorites`);
        FavoriteCompanion.find({}) // returns list of ids
            .then(favorites => {
                return FavoriteCompanion.getCompanions(favorites);
            })
            .then(companion_objects => {
                res.status(200).send(companion_objects)
            })
            .catch(err => {
                res.status(404).send({
                    message: "oops"
                })
            })

    })
    .post((req, res) => {
        console.log(`POST /companions/favorites`);
        res.status(501).send();
    })

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

router.route("/companions/:id/doctors")
    .get((req, res) => {
        console.log(`GET /companions/${req.params.id}/doctors`);
        Companion.findById(req.params.id)
            .then(comp => {
                console.log(comp.doctors);
                Doctor.find({
                    "_id" : {'$in' : comp.doctors}}) // _id not id!!!
                    .then(doctors => {
                        res.status(200).send(doctors);
                    })
            })
            .catch(err => {
                res.status(404).send({
                    message: "invalid id"
                })
            })
    });

    // ERRORS
router.route("/companions/:id/friends")
    .get((req, res) => { 
        console.log(`GET /companions/${req.params.id}/friends`);
        Companion.findById(req.params.id)
            .then(target_companion => {
                Companion.find(
                    {"seasons": {'$in' : target_companion.seasons}, 
                    "_id": {'$ne': req.params.id}})
                    .then(friends => {
                        res.status(200).send(friends);
                    })
                    .catch(err => {
                        res.status(404).send({
                            message: "other error"
                        })
                    })
            })
            .catch(err => {
                res.status(404).send({
                    message: "invalid id"
                })
            })
        
    });

// optional:
router.route("/companions/favorites/:companion_id")
    .delete((req, res) => {
        console.log(`DELETE /companions/favorites/${req.params.companion_id}`);
        FavoriteCompanion.findOneAndDelete(req.params.id)
            .then(comp => {
                res.status(200).send(null);
            })
            .catch(err => {
                res.status(500).send({
                    message: "id error"
                })
            })
    });

module.exports = router;