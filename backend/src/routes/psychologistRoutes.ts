import express, { Request, Response, NextFunction, Router } from 'express';
import mongoose from 'mongoose';

import * as deepl from '../utils/deepl';
import Psychologist from '../database/models/Psychologist';
import { IPsychologist, UserRole } from '../types';

const router: Router = express.Router();

function processPsychologist(psychologist: any, translate_keywords: boolean): Promise<IPsychologist> {
  return new Promise(function (resolve, reject) {
    let keywords: Promise<any>[] = []
    let source_lang = ""
    let target_lang = ""
    let source_keywords = ""
    let target_keywords = ""

    if (translate_keywords) {
      if (psychologist.keywords_cz.length > 0) {
        source_lang = "CS"
        target_lang = "EN"
        source_keywords = "keywords_cz"
        target_keywords = "keywords_en"
      } else if (psychologist.keywords_en.length > 0) {
        source_lang = "EN"
        target_lang = "CS"
        source_keywords = "keywords_en"
        target_keywords = "keywords_cz"
      }

      psychologist[source_keywords].forEach((keyword: string) => {
        keywords.push(deepl.translate(keyword, source_lang, target_lang))
      })

      // wait for all translations to complete
      Promise.all(keywords)
        .then(results => {
          results.forEach(result => {
            psychologist[target_keywords].push(result.translations[0].text)
          })

          resolve(psychologist)
        })
    } else {
      // no translation required
      resolve(psychologist)
    }
  })
}

// post method - creation of a new psychologist
router.post('/', (req, res, next) => {
  let psychologist = new Psychologist({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    email: req.body.email,
    website: req.body.website,
    keywords_cz: req.body.keywords_cz,
    keywords_en: req.body.keywords_en,
    image: req.body.image,
  });

  processPsychologist(psychologist, req.body.translate_keywords)
    .then(() => {
      psychologist.save()
        .then(result => {
          console.log("Info: Psychologist created: " + psychologist._id);

          res.status(200).json({
            message: "Psychologist uploaded successfully!",
            psychologist: {
              _id: result._id,
              psychologist: result,
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
})

// get all psychologists
router.get("/", (req, res, next) => {
  Psychologist.find()
    .then(data => {
      console.log("Info: Psychologists found: " + data.length);

      res.status(200).json({
        message: "Psychologist list retrieved successfully!",
        psychologists: data
      });
    })
    .catch(err => {
      console.error(err)
      res.status(500).json({
        error: err
      });
    })
});

// get psychologist profile by email (for logged-in user)
router.get("/profile/me", (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || !req.user.email) {
    return res.status(401).json({
      error: 'User not authenticated'
    });
  }

  Psychologist.findOne({ email: req.user.email.toLowerCase() })
    .then(data => {
      if (!data) {
        return res.status(404).json({
          error: 'Profile not found'
        });
      }

      console.log("Info: Psychologist profile found: " + data._id);

      res.status(200).json({
        message: "Psychologist profile retrieved successfully!",
        psychologist: data
      })
    })
    .catch(err => {
      console.error(err)
      res.status(500).json({
        error: err
      });
    });
});

// update psychologist profile by email (for logged-in user)
router.put("/profile/me", (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || !req.user.email) {
    return res.status(401).json({
      error: 'User not authenticated'
    });
  }

  // Only allow psychologists or admins to update profiles
  if (req.user.role !== UserRole.PSYCHOLOGIST && req.user.role !== UserRole.ADMINISTRATOR) {
    return res.status(403).json({
      error: 'Access denied: Insufficient permissions'
    });
  }

  processPsychologist(req.body, req.body.translate_keywords)
    .then((psychologist: any) => {
      // Preserve the image field from the request
      if (req.body.image !== undefined) {
        psychologist.image = req.body.image;
      }
      
      // Create update object without email to prevent email changes
      const updateData = {
        name: psychologist.name,
        website: psychologist.website,
        keywords_cz: psychologist.keywords_cz,
        keywords_en: psychologist.keywords_en,
        proposed_keywords: psychologist.proposed_keywords,
        image: psychologist.image
      };
      
      Psychologist.findOneAndUpdate({ email: req.user!.email!.toLowerCase() }, updateData, { new: true })
        .then((result: IPsychologist | null) => {
          if (!result) {
            return res.status(404).json({
              error: 'Profile not found'
            });
          }

          console.log("Info: Psychologist profile updated: " + result._id);

          res.status(200).json({
            message: "Psychologist profile updated successfully!",
            psychologist: result
          });
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
});

// get specific psychologist by id
router.get("/:id", (req, res, next) => {
  let psychologistId = req.params.id

  Psychologist.findOne({ '_id': psychologistId })
    .then(data => {
      console.log("Info: Psychologist found: " + data?._id);

      res.status(200).json({
        message: "Psychologist retrieved successfully!",
        psychologist: data
      })
    })
    .catch(err => {
      console.error(err)
      res.status(500).json({
        error: err
      });
    });
});

// update psychologist content based on psychologist id
router.put("/:id", (req, res, next) => {
  let psychologistId = req.params.id

  processPsychologist(req.body, req.body.translate_keywords)
    .then((psychologist: any) => {
      // Preserve the image field from the request
      if (req.body.image !== undefined) {
        psychologist.image = req.body.image;
      }
      
      Psychologist.findOneAndUpdate({ '_id': psychologistId }, psychologist)
        .then((result: IPsychologist | null) => {
          console.log("Info: Psychologist updated: " + psychologistId);

          res.status(200).json({
            message: "Psychologist updated successfully!",
            psychologist: result
          });
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
});

// delete psychologist based on id
router.delete("/:id", (req, res, next) => {
  let psychologistId = req.params.id

  Psychologist.deleteOne({ '_id': psychologistId })
    .then(data => {
      console.log("Info: Psychologist deleted: " + psychologistId);

      res.status(200).json({
        message: "Psychologist deleted successfully!",
        psychologist: data
      });
    })
    .catch(err => {
      console.error(err)
      res.status(500).json({
        error: err
      });
    })
});

router.put('/:id/keywords', (req, res, next) => {
  let psychologistId = req.params.id

  Psychologist.findOne({ '_id': psychologistId })
    .then(psychologist => {
      if (!psychologist) {
        throw new Error('Psychologist not found');
      }
      // combine existing and new proposed keywords and make unique
      let keywords = psychologist.proposed_keywords.concat(req.body)
      keywords = [...new Set(keywords)]

      // only add the proposed keywords which have not yet been added
      keywords = keywords.filter(element => !psychologist.keywords_en.includes(element))

      // save
      psychologist.proposed_keywords = keywords
      return psychologist.save()
    })
    .then(psychologist => {
      console.log("Info: Psychologist updated: " + psychologist._id);

      res.status(200).json({
        message: "Psychologist keywords updated successfully!",
        psychologist: psychologist
      });
    })
    .catch(err => {
      console.error(err)
      res.status(500).json({
        error: err
      });
    })
})

export default router;
