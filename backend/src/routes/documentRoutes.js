const express = require('express');
const mongoose = require('mongoose');

let Document = require('../database/models/Document');

const router = express.Router();

// post method - creation of a new document
router.post('/', (req, res, next) => {
    const document = new Document({
        _id: new mongoose.Types.ObjectId(),
        content_cz: req.body.document,
        content_en: req.body.document,
        keywords_cz: [],
        keywords_en: [],
        matched_psychologist: []
    });

    document.save()
    .then(result => {
        res.status(200).json({
            message: "Document uploaded successfully!",
            documentCreated: {
                _id: result._id,
                document: result,
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

// get all documents
router.get("/", (req, res, next) => {
    Document.find()
    .then(data => {
        res.status(200).json({
            message: "Document list retrieved successfully!",
            documents: data
        });
    });
});

// get specific document by id
router.get("/:id", (req, res, next) => {
    let documentId = req.params.id

    Document.findOne({ '_id': documentId})
    .then(data => {
        res.status(200).json({
            message: "Document retrieved successfully!",
            documents: data
        });
    });
});

// update document content based on document id
router.put("/:id", (req, res, next) => {
    let documentId = req.params.id
    
    Document.findOneAndUpdate({ '_id': documentId}, req.body)
    .then(data => {
        res.status(200).json({
            message: "Document updated successfully!",
            documents: data
        });
    });
});

// delete document based on id
router.delete("/:id", (req, res, next) => {
    let documentId = req.params.id

    Document.deleteOne({ '_id': documentId})
    .then(data => {
        res.status(200).json({
            message: "Document deleted retrieved successfully!",
            documents: data
        });
    });
});

module.exports = router;