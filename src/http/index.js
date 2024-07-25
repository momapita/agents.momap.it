import axios from 'axios';
//import { useAuthStore } from '@/stores/auth.js';

class ApiService {

  constructor(baseURL) {

    this.api = axios.create({
      baseURL: baseURL ?? "https://agents-api.momap.it/",
      timeout: 25000
    });

    /*// Interceptor per aggiungere il token JWT
    this.api.interceptors.request.use(config => {
      const authStore = useAuthStore();
      const token = authStore.token;

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    }, error => {
      return Promise.reject(error);
    });*/

  }

  handleResponse(response) {
    
    if (response?.status !== 200) {
      throw new Error('La chiamata API non è riuscita o non ha successo');
    }

    if(!('data' in response) || response?.data === null) {
      throw new Error('La chiamata API contiene nessun dato');
    }

    if(!('success' in response?.data) || response?.data?.success !== true) {
      throw new Error('La chiamata API ha restituito esito non valido');
    }

    return response?.data;
  }

  handleError(error) {
    if (error.response) {
      switch (error.response.status) {
        case 400:
          return new Error('Richiesta non valida: ' + error.response.data.message);
        case 401:
          return new Error('Non autorizzato: ' + error.response.data.message);
        case 404:
          return new Error('Risorsa non trovata: ' + error.response.data.message);
        case 422:
          return new Error('Errore di validazione: ' + error.response.data.message);
        case 429:
          return new Error('Troppi tentativi di accesso: ' + error.response.data.message);
        case 500:
          return new Error('Errore interno del server: ' + error.response.data.message);
        case 502:
          return new Error('Errore di rete: ' + error.response.data.message);
        case 503:
          return new Error('Servizio non disponibile: ' + error.response.data.message);
        case 504:
          return new Error('Timeout: ' + error.response.data.message);
        default:
          return new Error('Errore: ' + error.response.data.message);
      }
    } else if (error.request) {
      return new Error('Errore di rete: Impossibile raggiungere il server.');
    } else {
      return new Error('Errore nella richiesta: ' + error.message);
    }
  }

  async request(method, endpoint, data = null, config = {}) {
    try {
      const response = await this.api.request({ method, url: endpoint, data, ...config });
      return this.handleResponse(response);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async get(endpoint) {
    return this.request('get', endpoint);
  }

  async post(endpoint, data, responseType = null) {
    return this.request('post', endpoint, data, { responseType });
  }

  async put(endpoint, data) {
    return this.request('put', endpoint, data);
  }

  async delete(endpoint) {
    return this.request('delete', endpoint);
  }

  async postFile(endpoint, data) {
    return this.request('post', endpoint, data, { headers: { 'Content-Type': 'multipart/form-data' } });
  }

  setBaseURL(newBaseURL) {
    this.api.defaults.baseURL = newBaseURL;
  }

  setHeaders(headers) {
    this.api.defaults.headers = { ...this.api.defaults.headers, ...headers };
  }
  
}

const HttpService = new ApiService(import.meta.env.VITE_API_URL);

export default HttpService;
