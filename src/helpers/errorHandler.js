// utils/errorHandler.js
import ToastBus from '@/services/globalToastBus';
import i18n from "@/i18n";

// definisco il multilingua
const { t } = i18n.global;

// Funzione per gestire gli errori con un handler globale
export const executeWithGlobalErrorHandling = (fn, showMessage = true, successMessage = 'general.success', errorMessage = 'general.error') => async (...args) => {
  try {
      
      // eseguo la funzione
      const result = await fn(...args);

      // gestisco il toast di success
      showMessage && handleGlobalSuccess(successMessage);

      return result;
  } catch (error) {
    handleGlobalError(error, errorMessage, showMessage);
  }
};

// Funzione per gestire gli errori con un handler globale per l'onSubmit del formGenerator
export const executeFormWithGlobalErrorHandling = (fn, showMessage = true, successMessage = 'general.success', errorMessage = 'general.error') => async (...args) => {
  try {

    if(!args || !Array.isArray(args) || args.length === 0) {
      throw new Error('Invalid args');
    }

    const values = args[0] || {};

    // controllo che esista event
    if(!values || typeof values !== 'object' || Object.keys(values).length === 0) {
      throw new Error('Invalid event');
    }
  
    // controllo che esista event.event
    if(!values?.event || typeof values?.event !== 'object' || Object.keys(values?.event).length === 0) {
        throw new Error('Invalid event object');
    }
      
    // Eseguo la funzione
    const result = await fn(...args);

    // gestisco il toast di success
    showMessage && handleGlobalSuccess(successMessage);

    return result;
  } catch (error) {
    handleGlobalError(error, errorMessage, showMessage);
  }
};

// Funzione per gestire gli errori
const handleGlobalError = (originalError, errorMessage, showMessage) => {
  import.meta.env.VITE_DEVELOPMENT === 'true' && console.error(originalError);
  showMessage && ToastBus.emit(t(errorMessage), 'error');
};

// Funzione per gestire i successo
const handleGlobalSuccess = (message) => {
  ToastBus.emit(t(message), 'success');
};