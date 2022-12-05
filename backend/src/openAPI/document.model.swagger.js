let document = {}

document.getDocuments = {
    tags: ['Documents'],
    description: "Get list of documents",
    operationId: 'getDocuments',
    security: [
        {
            bearerAuth: []
        }
    ],
    produces: [
        "application/json"
    ],
    responses: {
        200: {
            description: "Get list of documents data",
            content: {
                "application/json": {
                    schema: {
                        "$ref": '#/components/schemas/Document'
                    }
                }
            }
        }
    }
}

document.getDocument = {
    tags: ['Documents'],
    description: "Get document based on id",
    operationId: 'getDocument',
    security: [
        {
            bearerAuth: []
        }
    ],
    produces: [
        "application/json"
    ],
    responses: {
        200: {
            description: "Get document based on id",
            content: {
                "application/json": {
                    schema: {
                        "$ref": '#/components/schemas/Document'
                    }
                }
            }
        }
    },
    parameters: [
        {
            name: "id",
            in: "path",
            description: "Document id",
            required: true,
            schema: {
                type: "string",
            }
        }
    ]
}

document.postDocument = {
    tags: ['Documents'],
    description: "Create new document",
    operationId: 'postDocument',
    security: [
        {
            bearerAuth: []
        }
    ],
    requestBody: {
        description: "Document data",
        required: true,
        content: {
            "application/json": {
                schema: {
                    "$ref": '#/components/schemas/Document'
                }
            }
        }
    },
    produces: [
        "application/json"
    ],
    responses: {
        200: {
            description: "Create new document",
            content: {
                "application/json": {
                    schema: {
                        "$ref": '#/components/schemas/Document'
                    }
                }
            }
        }
    },
}

document.deleteDocument = {
    tags: ['Documents'],
    description: "Delete document based on id",
    operationId: 'deleteDocument',
    security: [
        {
            bearerAuth: []
        }
    ],
    produces: [
        "application/json"
    ],
    responses: {
        200: {
            description: "Delete document based on id"
        }
    },
    parameters: [
        {
            name: "id",
            in: "path",
            description: "Document id",
            required: true,
            schema: {
                type: "string",
            }
        }
    ]
}

module.exports = document
