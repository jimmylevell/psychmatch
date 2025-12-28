let psychologist: any = {}

psychologist.getPsychologists = {
    tags: ['Psychologist'],
    description: "Get list of psychologists",
    operationId: 'getPsychologists',
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
            description: "Get list of psychologists data",
            content: {
                "application/json": {
                    schema: {
                        "$ref": '#/components/schemas/Psychologist'
                    }
                }
            }
        }
    }
}

psychologist.getPsychologist = {
    tags: ['Psychologist'],
    description: "Get psychologist based on id",
    operationId: 'getPsychologist',
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
            description: "Get psychologist based on id",
            content: {
                "application/json": {
                    schema: {
                        "$ref": '#/components/schemas/Psychologist'
                    }
                }
            }
        }
    },
    parameters: [
        {
            name: "id",
            in: "path",
            description: "Psychologist id",
            required: true,
            schema: {
                type: "string",
            }
        }
    ]
}

psychologist.postPsychologist = {
    tags: ['Psychologist'],
    description: "Create new psychologist",
    operationId: 'postPsychologist',
    security: [
        {
            bearerAuth: []
        }
    ],
    requestBody: {
        description: "Psychologist data",
        required: true,
        content: {
            "application/json": {
                schema: {
                    "$ref": '#/components/schemas/Psychologist'
                }
            }
        }
    },
    produces: [
        "application/json"
    ],
    responses: {
        200: {
            description: "Create new psychologist",
            content: {
                "application/json": {
                    schema: {
                        "$ref": '#/components/schemas/Psychologist'
                    }
                }
            }
        }
    },
}

psychologist.deletePsychologist = {
    tags: ['Psychologist'],
    description: "Delete psychologist based on id",
    operationId: 'deletePsychologist',
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
            description: "Delete psychologist based on id"
        }
    },
    parameters: [
        {
            name: "id",
            in: "path",
            description: "Psychologist id",
            required: true,
            schema: {
                type: "string",
            }
        }
    ]
}

export default psychologist
