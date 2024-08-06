/***** Queste sono tutte utilità per la gestione dei form e dei modelli del form *****/

// Import dei servizi
import DateServices from '@/helpers/date';

// Import per vee validate
import { defineRule } from 'vee-validate';
import { all } from '@vee-validate/rules';

// Funzione per resettare un modello semplice
export const ResetModel = (model) => {
    return Object.fromEntries(Object.keys(model.value).map((key) => [key, null]));
};

// Funzione per resettare un modello del form
export const resetFormModel = (model, showElements = [], notShowElements = []) => {
    try {
  
      // Controllo se il modello è valido
      if (!model.value || typeof model.value !== 'object' || Object.keys(model.value).length === 0) {
        throw new Error('Il modello fornito non è valido');
      }
  
      // Usare reduce per creare il nuovo modello resettato
      const resetNewModel = Object.entries(model.value).reduce((acc, [key, field]) => {
        acc[key] = {
          key: field?.key || null,
          label: field?.label || null,
          extraLabels: field?.extraLabels || null,
          placeholder: field?.placeholder || null,
          type: field?.type || null,
          model: field?.notReset && field?.notReset === true ? field.model : field?.resetString && field?.resetString === true ? "" : null,
          notShow: notShowElements.includes(key) ? true : showElements.includes(key) ? false : field?.notShow || false,
          notReset: field?.notReset || false,
          resetString: field?.resetString || false,
          send: field?.send || null,
          rules: field?.rules,
          bind: field?.bind,
          autocompleteReference: field?.autocompleteReference || null,
          localTranslate: field?.localTranslate || false,
          arrToString: field?.arrToString || false
        };
        return acc;
      }, {});
  
      return resetNewModel;
    } catch (error) {
      return null;
    }
};

// Funzione per riempire un modello semplice
const getLocalModel = (data, key, field, internalModel) => {
  
  // Convert the array to a string
  const convertArrayToString = (arr) => arr.map(String);

  if (data.hasOwnProperty(key)) {
    if (internalModel === false) {
      return Array.isArray(data[key]) && field?.arrToString ? convertArrayToString(data[key]) : data[key];
    } else {
      return Array.isArray(data[key]?.model) && field?.arrToString  ? convertArrayToString(data[key]?.model)  : data[key]?.model;
    }
  } else {
    if (field?.resetString) {
      return "";
    } else {
      return Array.isArray(field?.model) && field?.arrToString  ? convertArrayToString(field?.model)  : field?.model ?? null;
    }
  }
};

// Funzione per riempire un modello del form
export const fillFormModel = (model, data, notShowElements = [], showElements = [], internalModel = false, disabledElements = []) => {
    try {
  
      // Controllo se il modello è valido
      if (!model.value || typeof model.value !== 'object' || Object.keys(model.value).length === 0) {
        throw new Error('Il modello fornito non è valido');
      }
  
      // Controllo se i dati sono validi
      if (!data || typeof data !== 'object' || Object.keys(data).length === 0) {
        throw new Error('I dati forniti non sono validi');
      }
  
      // Creo il nuovo modello riempito
      const filledNewModel = Object.entries(model.value).reduce((acc, [key, field]) => {
        
        // Creo il modello locale
        const localModel = getLocalModel(data, key, field, internalModel);

        // Creo il bind locale
        const bind = disabledElements.includes(key) && field?.bind ? { ...field.bind, disabled: true } : (field?.bind || null);
        
        acc[key] = {
          key: field?.key || null,
          label: field?.label || null,
          extraLabels: field?.extraLabels || null,
          placeholder: field?.placeholder || null,
          type: field?.type || null,
          model: localModel,
          notShow: notShowElements.includes(key) ? true : showElements.includes(key) ? false : field?.notShow || false,
          notReset: field?.notReset || false,
          resetString: field?.resetString || false,
          send: field?.send || null,
          rules: field?.rules,
          bind: bind,
          autocompleteReference: field?.autocompleteReference || null,
          localTranslate: field?.localTranslate || false,
          arrToString: field?.arrToString || false
        };
        return acc;
      }, {});
  
      return filledNewModel;
    } catch (error) {
      return null;
    }
};

// Funzione per formattare il valore 'event' del form 
export const formatEvent = (event) => {
    try {
      
        // Controllo se l'evento è valido
      if (!event || typeof event !== 'object' || !Object.keys(event).length) {
        throw new Error('L\'evento fornito non è valido');
      }
  
      const formattedEvent = {};
      for (const key in event) {
        if (event.hasOwnProperty(key)) {
          const value = event[key];
          if (value instanceof Date) {
            formattedEvent[key] = DateServices.formatDateValue(value);
          } else {
            formattedEvent[key] = value === '' ? null : value;
          }
        }
      }
  
      return formattedEvent;
    } catch (error) {
      return event;
    }
}

// Funzione per validare la struttura del model passato ai generatori
export const validateFormModel = (model) => {
  
    // Definisco un oggetto contenente i requisiti per ciascun tipo di elemento
    const typeRequirements = {
      toggle: ["bind"],
      dropdown: ["bind"],
      multiselect: ["bind"],
      autocomplete: ["bind"],
    };
  
    // Definisco un oggetto contenente i requisiti per la dropdown
    const dropdownRequirements = ["optionLabel", "options", "optionValue"];
  
    // Controllo che model sia un oggetto ed abbia almeno una chiave
    if (!model || typeof model !== "object" || !Object.keys(model).length) {
      return false;
    }
  
    // Itero su ciascun elemento nell'oggetto formModel
    for (const key in model) {
      // Controllo che la chiave sia effettivamente una chiave dell'oggetto
      if (Object.hasOwnProperty.call(model, key)) {
        
        // Estraggo l'elemento corrente
        const element = model[key];
  
        // Controllo che l'elemento abbia il tipo definito
        const requiredKeys = typeRequirements[element.type] || [];
  
        // genero le key totali
        const allKeys = [
          ...requiredKeys,
          "label",
          "placeholder",
          "type",
          "model",
        ];
  
        // Controllo che tutte le chiavi richieste siano presenti nell'elemento
        for (const reqKey of allKeys) {
          if (!(reqKey in element)) {
            return false;
          }
        }
  
        // Controllo che la chiave bind contenga le chiavi specifiche per la dropdown
        if ((element.type === "dropdown" && element.type === "multiselect" ) && element.bind) {
          const bindKeys = Object.keys(element.bind);
          for (const reqKey of dropdownRequirements) {
            if (!bindKeys.includes(reqKey)) {
              return false;
            }
          }
        }
      }
    }
  
    // Se tutte le chiavi richieste sono presenti in tutti gli elementi, restituisco true
    return true;
};

// Funzione per formattare i valori del model passato ai generatori
export const formatFormModelValues = (model) => {
    try {
  
      // Controllo che la formattazione sia valida
      if (!model || typeof model !== 'object' || !Object.keys(model).length) {
        throw new Error('Il modello fornito non è valido');
      }
  
      if(!validateFormModel(model)){
        throw new Error('Il modello fornito non è valido');
      }
  
      // Funzione per formattare i valori di tipo toggle
      const formatToggleValue = (value) => {
        
        if (typeof value === 'number') {
          return !!value;
        }
  
        if (typeof value === 'string') {
          
          //controllo se il valore è un numero
          if (!isNaN(parseFloat(value))) {
            return !!parseFloat(value);
          }
  
          return value.toLowerCase() === 'si';
        }
  
        if(value === null){
          return false;
        }
  
        return value;
      };
  
      // Funzione per formattare i valori di tipo number
      const formatNumberValue = (value) => {
        if (typeof value === 'string' && !isNaN(parseFloat(value))) {
          return parseFloat(value);
        } else if (typeof value === 'string') {
          return 0;
        }
        return value;
      };
  
      // Funzione per formattare i valori di tipo calendar
      const formatDateValue = (value) => {
        return DateServices.checkDate(value) ? new Date(value) : null;
      };
  
      // Itero gli elementi per formattare i valori
      const formattedArray = Object.entries(model).map(([key, element]) => {
        return [
           key,
          {
            ...element,
            model: (() => {
              switch (element.type) {
                case 'toggle':
                  return formatToggleValue(element.model);
                case 'number':
                  return formatNumberValue(element.model); 
                case 'calendar':
                  return formatDateValue(element.model); 
                default:
                  return element.model;
                }
              })()
            }
        ];
      });
  
      // Creo un nuovo oggetto formattato
      const formattedModel = Object.fromEntries(formattedArray);
  
      // Restituiamo il modello formattato
      return formattedModel;
  
    } catch (error) {
      console.error('Error in formatFormModelValues', error);
      return null;
    }
}

// Funzione per configurare la validazione di vee-validate
export const setGlobalRules = () => {
  Object.entries(all).forEach(([name, rule]) => {
    defineRule(name, rule);
  });
}