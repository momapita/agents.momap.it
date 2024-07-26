// Based imports
import {defineAsyncComponent} from "vue";
import i18n from "@/i18n";

// date services
import DateServices from '@/helpers/date';

// services imports
import MatchModes from '@/helpers/matchModes';
import { isMobile } from 'mobile-device-detect';

// modale bus import
import DialogBus from '@/services/globalDialogBus';

// import infoWrapper component
import InfoWrapper from '@/components/dataViews/helpersComponents/InfoWrapper.vue';

// Definisco il multilingua
const  { t, d } = i18n.global;

class TableHelper {

    constructor() {
        this.matchModes = MatchModes;
    }

    getMatchModes() {
        return this.matchModes;
    }

    getMatchMode(mode) {
        return (mode in this.matchModes) ? this.matchModes[mode] : null;
    }

    setRowsPerPage(rows) {
        const options = [5, 10, 20, 50, 100];
        !options.includes(rows) && options.push(rows);
        return options.sort((a, b) => a - b);
    }

    setBaseLazyParams(rows) {
        return {
            first: 0,
            sortField: null,
            sortOrder: null,
            filters: null,
            rows,
        }
    }

    truncateString(string = null, length = 15, returnCondition = false) {
        if (typeof string !== "string" || !string) {
            return returnCondition ? false : "";
        }
        
        if (returnCondition) {
            return string.length > length;
        }
        
        return string.length > length ? `${string.slice(0, length)}...` : string;
    }

    basedDialogOptions(){
        return {
            props: {
                modal: true,
                draggable: true,
                dismissableMask: true,
                maximizable: true,
                style: {
                    width: '50vw',
                },
            }
        }
    }

    test123(){

        const options = {
            ...this.basedDialogOptions(),
            data: {
                info: 'test informazioni'
            }
        }

        DialogBus.emit(InfoWrapper, options);
    }

    //formatterBaseCols()
}

const TableServices = new TableHelper();

export default TableServices;