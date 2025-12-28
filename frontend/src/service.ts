const API = process.env.REACT_APP_BACKEND_URL;

export interface Document {
  _id: string;
  content_cz: string;
  content_en: string;
  keywords_cz: string[];
  keywords_en: string[];
  matched_psychologists: MatchedPsychologist[];
  updatedAt: string;
  createdAt: string;
}

export interface MatchedPsychologist {
  psychologist: string;
  score: number;
  most_important_matches: Match[];
}

export interface Match {
  document_keyword: string;
  psychologist_keyword: string;
  score: number;
}

export interface Psychologist {
  _id: string;
  name: string;
  website: string;
  keywords_cz: string[];
  keywords_en: string[];
  proposed_keywords: string[];
  translate_keywords: boolean;
  updatedAt?: string;
  createdAt?: string;
}

export interface DocumentsResponse {
  documents: Document[];
}

export interface DocumentResponse {
  document: Document;
}

export interface PsychologistsResponse {
  psychologists: Psychologist[];
}

export interface PsychologistResponse {
  psychologist: Psychologist;
}

export class ModelService {
  data: any[] = [];
  private static instance: ModelService;
  static token: string | null = null;

  constructor() {
    if (ModelService.instance) {
      throw new Error("Error: Instantiation failed: Use ModelService.getInstance() instead of new.");
    }
  }

  // singleton static method to get instance of service
  static getInstance(token?: string): ModelService {
    if (!ModelService.instance) {
      console.log("creating new instance")
    }
    ModelService.instance = ModelService.instance || new ModelService();

    if (token && ModelService.token !== token) {
      ModelService.token = token;
    }
    return ModelService.instance;
  }

  // used to communicate with backend
  async fetch<T>(method: string, endpoint: string, body?: any): Promise<T> {
    try {
      let header: RequestInit = {};
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
  async getDocuments(): Promise<DocumentsResponse> {
    try {
      return this.fetch<DocumentsResponse>('GET', '/documents', '').then((response) => {
        return response;
      });
    }
    catch (error) {
      throw new Error(String(error));
    }
  }

  // get document
  async getDocument(documentId: string): Promise<Document> {
    try {
      return this.fetch<DocumentResponse>('GET', `/documents/${documentId}`, '').then((response) => {
        return response.document;
      })
    }
    catch (error) {
      throw new Error(String(error));
    }
  }

  // new document
  async newDocument(document: Partial<Document>): Promise<any> {
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
  async updateDocument(documentId: string, document: Partial<Document>): Promise<any> {
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
  async deleteDocument(documentId: string): Promise<any> {
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
  async reexecuteDocument(documentId: string): Promise<Document> {
    try {
      return this.fetch<DocumentResponse>('GET', '/documents/' + documentId + "/reexecute",).then((response) => {
        return response.document;
      })
    }

    catch (error) {
      throw new Error(String(error));
    }
  }

  // get psychologists
  async getPsychologists(): Promise<Psychologist[]> {
    try {
      return this.fetch<PsychologistsResponse>('GET', '/psychologists', '').then((response) => {
        return response.psychologists;
      })
    }
    catch (error) {
      throw new Error(String(error));
    }
  }

  // new psychologist
  async newPsychologist(psychologist: Partial<Psychologist>): Promise<any> {
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
  async getPsychologist(psychologistId: string): Promise<Psychologist> {
    try {
      return this.fetch<PsychologistResponse>('GET', `/psychologists/${psychologistId}`, '').then((response) => {
        return response.psychologist;
      })
    }
    catch (error) {
      throw new Error(String(error));
    }
  }

  // update psychologist
  async updatePsychologist(psychologistId: string, psychologist: Partial<Psychologist>): Promise<any> {
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
  addKeywordsToPsychologist(psychologistId: string, keywords: string[]): Promise<any> {
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
  async deletePsychologist(psychologistId: string): Promise<any> {
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
