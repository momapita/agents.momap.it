import axios from 'axios';
import { cacheAdapterEnhancer, throttleAdapterEnhancer } from 'axios-extensions';
import adapter from 'axios/lib/adapters/xhr';

// Setto l'url di base e l'adapter
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL ?? "https://apidev.momap.it/v1",
    adapter: throttleAdapterEnhancer(cacheAdapterEnhancer(adapter, true))
});

/* Aggiungo il token jwt
import { useAuthStore } from '@/stores/auth.js';
api.interceptors.request.use(config => {
    const authStore = useAuthStore();
    const token = authStore.token;
  
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  
    return config;
});*/

// Metodo Get
export async function getRequest(endpoint) {
    try {
      const response = await api.get(endpoint);
  
      if(response.status != 200){
        throw new Error('La chiamata API non è riuscita o non ha successo.');
      }
  
      // restituisco tempData
      return response.data;
  
    } catch (error) {
      throw error;
    }
}

// Metodo Post
export async function postRequest(endpoint, data, responseType = null) {
    try {
      
        const response = await api.post(endpoint, data, responseType);
  
      if(response.status != 200){
        throw new Error('La chiamata API non è riuscita o non ha successo.');
      }
  
      let tempData = response.data;
  
      if(responseType != null){
        return tempData;
      }
  
      if(tempData.success != true){
        throw new Error(tempData?.error ?? 'La chiamata API non è riuscita o non ha successo.');
      }
  
      // restituisco tempData
      return tempData;
  
    } catch (error) {
      throw error;
    }
}

// Metodo postFile
export async function postFileRequest(endpoint, data) {
    try {
    
      const response = await api.post(endpoint, data, { headers: { 'Content-Type': 'multipart/form-data'} });
  
      if (response.status !== 200) {
        throw new Error('La chiamata API non è riuscita o non ha successo.');
      }
  
      return response.data;
    } catch (error) {
      throw error;
    }
}

export default api;