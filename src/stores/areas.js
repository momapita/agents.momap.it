import { defineStore } from 'pinia';
import Middleware from '@/router/middleware.js';
import { executeWithGlobalErrorHandling } from '@/helpers/errorHandler';
import HttpService from "@/http";

export const useAreasStore = defineStore('areas', {
    
    state: () => ({
        areas: null,
        isLoading: false,
    }),

    actions: {
        
        async setAreas() {
            this.isLoading = true;

            await executeWithGlobalErrorHandling(async () => {
                
                if (!Middleware.hasPermission('admin')) {
                    throw new Error('Permission Denied');
                }

                if(this.areas !== null) {
                    return;
                }

                // Effettuo la chiamata HTTP
                const response = await HttpService.get('allDetailsGeo');

                // setto i dati
                this.areas = Object.values(response?.data) || [];
                this.isLoading = false;

            }, false).call(this);
        }

    },

    getters: {

        // Recupero tutte le aree
        allAreas: (state) => state.areas,

        // Recupero le aree geografiche
        getGeographicalAreas: (state) => {
            return state.areas?.map(item => ({
                id: item.id,
                label: item?.description ? item.description.toLowerCase() : null
            }))
        },

        // Recupero le regioni della specifica area geografica
        getRegionsByAreaId: (state) => (areaId) => {
            const area = state.areas.find(area => parseInt(area.id) === parseInt(areaId));
            return area?.regions ? Object.values(area.regions).map(({ id, name }) => ({ id, label: name })) : [];
        },

        // Recupero le province dato un id o ids di regioni
        getProvincesByRegionIds: (state) => (regionIds) => {

            // Creo un set di regioni dagli id passati
            const regionIdSet = new Set(regionIds);

            const provincesObject = Object.values(state.areas).flatMap( area =>
                Object.entries(area.regions) // Per ogni area, estraggo le regioni
                .filter(([regionId]) => regionIdSet.has(parseInt(regionId))) // filtro le regioni
                .map(([, region]) => region.provinces) // recupero le province
            ).reduce((acc, provinces) => ({ ...acc, ...provinces }), {});

            return Object.values(provincesObject).map(({ id, name }) => ({ id, label: name }));
        },
        
        // Recupero i comuni dato un id o ids di province
        getMunicipalitiesByProvinceIds: (state) => (provinceIds) => {
            
            // Creo un set di province dagli id passati per un accesso più veloce
            const provinceIdSet = new Set(provinceIds);
        
            // Recupero i comuni per le province filtrate
            const municipalities = Object.values(state.areas).flatMap(area =>
                Object.values(area.regions).flatMap(region =>
                    Object.entries(region.provinces)
                    .filter(([provinceId]) => provinceIdSet.has(parseInt(provinceId)))
                    .flatMap(([, province]) => Object.values(province.municipalities))
                )
            );
        
            // Ritorno i comuni con id e label
            return municipalities.map(({ municipality_id, municipality_name }) => ({
                id: municipality_id,
                label: municipality_name
            }));
        }

    }
});

// Esegui l'inizializzazione automatica del store
await useAreasStore().setAreas();