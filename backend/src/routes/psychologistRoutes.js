const express = require('express');
const mongoose = require('mongoose');

let Psychologist = require('../database/models/Psychologist');

const router = express.Router();

// post method - creation of a new psychologist
router.post('/', (req, res, next) => {
  const psychologist = new Psychologist({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    website: req.body.website,
    keywords_cz: [],
    keywords_en: [],
  });

  psychologist.save()
  .then(result => {
    res.status(200).json({
      message: "Psychologist uploaded successfully!",
      psychologist: {
        _id: result._id,
        psychologist: result,
      }
    })  
  })
  .catch(err => {
    console.log(err)
    res.status(500).json({
      error: err
    });
  })
})

// get all psychologists
router.get("/", (req, res, next) => {
  Psychologist.find()
  .then(data => {
    res.status(200).json({
      message: "Psychologist list retrieved successfully!",
      psychologists: data
    });
  });
});

// get specific psychologist by id
router.get("/:id", (req, res, next) => {
  let psychologistId = req.params.id

  Psychologist.findOne({ '_id': psychologistId})
  .then(data => {
    res.status(200).json({
      message: "Psychologist retrieved successfully!",
      psychologist: data
    });
  });
});

// update psychologist content based on psychologist id
router.put("/:id", (req, res, next) => {
  let psychologistId = req.params.id
  
  Psychologist.findOneAndUpdate({ '_id': psychologistId}, req.body)
  .then(data => {
    res.status(200).json({
      message: "Psychologist updated successfully!",
      psychologist: data
    });
  });
});

// delete psychologist based on id
router.delete("/:id", (req, res, next) => {
  let psychologistId = req.params.id

  Psychologist.deleteOne({ '_id': psychologistId})
  .then(data => {
    res.status(200).json({
      message: "Psychologist deleted successfully!",
      psychologist: data
    });
  });
});

module.exports = router;