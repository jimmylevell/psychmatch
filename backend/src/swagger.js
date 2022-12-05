const document = require("./openAPI/document.model.swagger")
const psycholigst = require("./openAPI/psychologist.model.swagger")

const swaggerDocument = {
    openapi: '3.0.1',
    info: {
        version: '1.0.0',
        title: 'Psychmatch backend',
        description: 'Psychmatch NodeJS backend',
        termsOfService: '',
        contact: {
            name: 'James Levell',
            email: 'jimmy.levell@outlook.com'
        }
    },
    tags: [
        { name: "Documents" },
        { name: "Psychologist" },
    ],
    paths: {
        "/api/documents": {
            "get": document.getDocuments,
            "post": document.postDocument,
            "delete": document.deleteDocument
        },
        "/api/documents/{id}": {
            "get": document.getDocument
        },

        "/api/psycholigsts": {
            "get": psycholigst.getPsychologists,
            "post": psycholigst.postPsychologist,
            "delete": psycholigst.deletePsychologist
        },
        "/api/psycholigsts/{id}": {
            "get": psycholigst.getPsychologist
        }
    },
    components: {
        schemas: {
            Psychologist: {
                type: "object",
                properties: {
                    _id: {
                        type: "string",
                    },
                    name: {
                        type: "string",
                    },
                    website: {
                        type: "string",
                    },
                    keywords_cz: {
                        type: "array",
                    },
                    keywords_en: {
                        type: "array",
                    },
                }
            },
            Document: {
                type: "object",
                properties: {
                    _id: {
                        type: "string",
                    },
                    "content_cz": {
                        type: "string",
                    },
                    "content_en": {
                        type: "string",
                    },
                    "keywords_cz": {
                        type: "array",
                    },
                    "keywords_en": {
                        type: "array",
                    },
                    "matched_psychologists": {
                        type: "array",
                    }
                }
            }
        }
    }
}

module.exports = swaggerDocument
