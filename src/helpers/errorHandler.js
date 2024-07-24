// utils/errorHandler.js
import ToastBus from '@/services/globalToastBus';
import i18n from "@/i18n";

// definisco il multilingua
const { t } = i18n.global;

// Funzione per gestire gli errori con un handler globale
export const withErrorHandling = (fn, successMessage = 'general.success', errorMessage = 'general.error') => async (...args) => {
  try {
      
      // eseguo la funzione
      const result = await fn(...args);

      // gestisco il toast di success
      handleGlobalSuccess(successMessage);

      return result;
  } catch (error) {
    handleGlobalError(error, errorMessage);
  }
};

// Funzione per gestire gli errori
const handleGlobalError = (originalError, errorMessage) => {
  import.meta.env.VITE_DEVELOPMENT === 'true' && console.error(originalError);
  ToastBus.emit(t(errorMessage), 'error');
};

// Funzione per gestire i successo
const handleGlobalSuccess = (message) => {
  ToastBus.emit(t(message), 'success');
};