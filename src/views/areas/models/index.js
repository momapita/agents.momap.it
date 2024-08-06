// based imports
import i18n from "@/i18n";

// store imports
import { useAreasStore } from '@/stores/areas.js';

export default {
    ar__area_id: {
        key: "ar__area_id",
        label: "ar__area_id",
        placeholder: "ar__area_id",
        model: null,
        type: "text",
        rules: 'required',
        notShow: true
    },
    ar__name: {
        key: "ar__name",
        label: "ar__name",
        placeholder: "ar__name",
        model: null,
        type: "text",
        rules: 'required|min:4',
    },
    regions_ids: {
        key: "regions_ids",
        label: "regions_ids",
        placeholder: "regions_ids",
        model: null,
        type: "text",
        rules: 'required'
    },
    provinces_ids: {
        key: "provinces_ids",
        label: "provinces_ids",
        placeholder: "provinces_ids",
        model: null,
        type: "text",
        rules: 'required'
    },
    municipality_ids: {
        key: "municipality_ids",
        label: "municipality_ids",
        placeholder: "municipality_ids",
        model: null,
        type: "text",
        rules: 'required'
    }
}