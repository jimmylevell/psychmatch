const express = require('express');
const mongoose = require('mongoose');
const deepl = require('../utils/deepl.js');
const keywordextraction = require('../utils/keywordextraction.js');
const matchMaking = require('../utils/matchMaking.js');

let Document = require('../database/models/Document');
let Psychologist = require('../database/models/Psychologist');

const router = express.Router();

function processDocument(document) {
  return new Promise(function (resolve, reject) {
    deepl.translate(document.content_cz, 'CS', 'EN')
      .then((result) => {
        document.content_en = result.translations[0].text;
      })
      .then(() => {
        // czech language is only supported with RAKE
        document.keywords_cz = keywordextraction.extractRake(document.content_cz, "czech")

        // english can be extracted with the language model
        return keywordextraction.extractLanguageModel(document.content_en)
      })
      .then((result) => {
        document.keywords_en = result
      })
      .then(() => {
        return Psychologist.find()
      })
      .then((psychologists) => {
        return matchMaking.match(psychologists, document)
      })
      .then((result) => {
        document.matched_psychologists = result
        resolve(document)
      })
      .catch(err => {
        console.error("Issue preprocessing file: " + err);
        reject(err);
      })
  })
}

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

  processDocument(document)
    .then(document => {
      document.save()
        .then(result => {
          console.log("Info: Document created: " + document._id);

          res.status(200).json({
            message: "Document uploaded successfully!",
            document: {
              _id: result._id,
              document: document,
            }
          })
        })
        .catch(err => {
          console.error(err)
          res.status(500).json({
            error: err
          });
        })
    })
    .catch(err => {
      console.error(err)
      res.status(500).json({
        error: err
      });
    })
})

// get all documents
router.get("/", (req, res, next) => {
  Document.find()
    .then(data => {
      console.log("Info: Documents found: " + data.length);

      res.status(200).json({
        message: "Document list retrieved successfully!",
        documents: data
      });
    })
    .catch(err => {
      console.error(err)
      res.status(500).json({
        error: err
      });
    })
});

// get specific document by id
router.get("/:id", (req, res, next) => {
  let documentId = req.params.id

  Document.findOne({ '_id': documentId })
    .then(data => {
      console.log("Info: Document found: " + data._id);

      res.status(200).json({
        message: "Document retrieved successfully!",
        document: data
      });
    })
    .catch(err => {
      console.error(err)
      res.status(500).json({
        error: err
      });
    })
});

// update document content based on document id
router.put("/:id", (req, res, next) => {
  let documentId = req.params.id

  Document.findOneAndUpdate({ '_id': documentId }, req.body)
    .then(data => {
      console.log("Info: Document updated: " + data._id);

      res.status(200).json({
        message: "Document updated successfully!",
        document: data
      });
    })
    .catch(err => {
      console.error(err)
      res.status(500).json({
        error: err
      });
    })
});

// delete document based on id
router.delete("/:id", (req, res, next) => {
  let documentId = req.params.id

  Document.deleteOne({ '_id': documentId })
    .then(data => {
      console.log("Info: Document deleted: " + data._id);

      res.status(200).json({
        message: "Document deleted successfully!",
        document: data
      });
    })
    .catch(err => {
      console.error(err)
      res.status(500).json({
        error: err
      });
    })
});

// get method - trigger rexexecution of document
router.get('/:id/reexecute', (req, res, next) => {
  let documentId = req.params.id

  Document.findOne({ '_id': documentId })
    .then(data => {
      // reexecute document
      processDocument(data)
        .then(document => {
          document.save().then(result => {
            console.log("Info: Document reexecuted: " + document._id);

            res.status(200).json({
              message: "Document reexecuted updated successfully!",
              documentCreated: {
                _id: result._id,
                document: result,
              }
            })
          })
        })
        .catch(err => {
          console.error(err)
          res.status(500).json({
            error: err
          });
        })
    })
    .catch(err => {
      console.error(err)
      res.status(500).json({
        error: err
      });
    })
})

module.exports = router;
