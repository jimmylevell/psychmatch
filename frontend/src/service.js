const API = process.env.REACT_APP_BACKEND_URL;

export class ModelService {
  data = [];

  constructor() {
    if (ModelService.instance) {
      throw new Error("Error: Instantiation failed: Use ModelService.getInstance() instead of new.");
    }
  }

  // singleton static method to get instance of service
  static getInstance(token) {
    if (!ModelService.instance) {
      console.log("creating new instance")
    }
    ModelService.instance = ModelService.instance || new ModelService();

    if (token && ModelService.instance.token !== token) {
      ModelService.token = token;
    }
    return ModelService.instance;
  }

  // used to communicate with backend
  async fetch(method, endpoint, body) {
    try {
      let header = {};
      if (method === 'GET') {
        header = {
          method,
          headers: {
            'content-type': 'application/json',
            Authorization: `Bearer ${ModelService.token}`,
            'accept': 'application/json',
          },
        };
      }
      else {
        header = {
          method,
          body: body && JSON.stringify(body),
          headers: {
            'content-type': 'application/json',
            Authorization: `Bearer ${ModelService.token}`,
            'accept': 'application/json',
          },
        };
      }

      const response = await fetch(`${API}/api${endpoint}`, header);
      if (response.ok && (response.status === 201 || response.status === 200)) {
        return await response.json();
      }
      else {
        throw new Error('Error communicating with backend');
      }
    }

    catch (error) {
      throw new Error(String(error));
    }
  }

  // returns all documents
  async getDocuments() {
    try {
      return this.fetch('GET', '/documents', '').then((response) => {
        this.data = response;
        return this.data;
      });
    }
    catch (error) {
      throw new Error(String(error));
    }
  }

  // get document
  async getDocument(documentId) {
    try {
      return this.fetch('GET', `/documents/${documentId}`, '').then((response) => {
        return response.document;
      })
    }
    catch (error) {
      throw new Error(String(error));
    }
  }

  // new document
  async newDocument(document) {
    try {
      return this.fetch('POST', '/documents', document).then((response) => {
        return response;
      })
    }

    catch (error) {
      throw new Error(String(error));
    }
  }

  // update document
  async updateDocument(documentId, document) {
    try {
      return this.fetch('PUT', `/documents/${documentId}`, document).then((response) => {
        return response;
      })
    }
    catch (error) {
      throw new Error(String(error));
    }
  }

  // delete document
  async deleteDocument(documentId) {
    try {
      return this.fetch('DELETE', `/documents/${documentId}`, '').then((response) => {
        return response;
      })
    }
    catch (error) {
      throw new Error(String(error));
    }
  }

  // reexecute document
  async reexecuteDocument(documentId) {
    try {
      return this.fetch('GET', '/documents/' + documentId + "/reexecute",).then((response) => {
        return response.document;
      })
    }

    catch (error) {
      throw new Error(String(error));
    }
  }

  // get psychologists
  async getPsychologists() {
    try {
      return this.fetch('GET', '/psychologists', '').then((response) => {
        return response.psychologists;
      })
    }
    catch (error) {
      throw new Error(String(error));
    }
  }

  // new psychologist
  async newPsychologist(psychologist) {
    try {
      return this.fetch('POST', '/psychologists', psychologist).then((response) => {
        return response;
      })
    }
    catch (error) {
      throw new Error(String(error));
    }
  }

  // get psychologist
  async getPsychologist(psychologistId) {
    try {
      return this.fetch('GET', `/psychologists/${psychologistId}`, '').then((response) => {
        return response.psychologist;
      })
    }
    catch (error) {
      throw new Error(String(error));
    }
  }

  // update psychologist
  async updatePsychologist(psychologistId, psychologist) {
    try {
      return this.fetch('PUT', `/psychologists/${psychologistId}`, psychologist).then((response) => {
        return response;
      })
    }
    catch (error) {
      throw new Error(String(error));
    }
  }

  // add keywords to psychologist
  addKeywordsToPsychologist(psychologistId, keywords) {
    try {
      return this.fetch('PUT', `/psychologists/${psychologistId}/keywords`, keywords).then((response) => {
        return response;
      })
    }
    catch (error) {
      throw new Error(String(error));
    }
  }

  // delete psychologist
  async deletePsychologist(psychologistId) {
    try {
      return this.fetch('DELETE', `/psychologists/${psychologistId}`, '').then((response) => {
        return response;
      })
    }
    catch (error) {
      throw new Error(String(error));
    }
  }
}
