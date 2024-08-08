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

    emitShowInfo(data){
        DialogBus.emit(InfoWrapper, { data });
    }

    formatterBaseCols(arr, valTruncate = 15, translateKey = null){
        return arr.map((el) => {
            return {
                header: el,
                components: defineAsyncComponent(() => import("@/components/reusable/Empity.vue")),
                formatter: {
                    multiple: false,
                    format: (val) => {
                      return val ? this.truncateString(translateKey ? t(`${translateKey}.${val}`) : val, valTruncate) : t("general.dataNotFound");
                    },
                },
                dinamicProps: (colData) => {
                    return {
                      onclick: () => {
                        this.truncateString(colData, valTruncate, true) && this.emitShowInfo(colData);
                      },
                      class: this.truncateString(colData, valTruncate, true) ? "cursor-pointer underline max-w-full truncate-all text-zinc-400 dark:text-zinc-100" : "",
                    };
                },
            }
        });
    }

    formatterDateCols(arr, formatterObj = null){
        return arr.map((el) => {
            return {
                header: el,
                components: defineAsyncComponent(() => import("@/components/reusable/Empity.vue")),
                formatter: {
                    multiple: false,
                    format: (val = null) => {

                        // recupero le informazioni della formattazione
                        const {format = "longNoWeekday", applyTimezone = true } = formatterObj || {};

                        // verifico se la data è valida
                        if(!DateServices.checkDate(val) || !val){
                            return '';
                        }

                        const formattedDate = DateServices.formatDate(val, 'YYYY-MM-DD HH:mm:ss', applyTimezone);
                        return d(formattedDate, format);
                    },
                },
                filterModel: {
                    components: defineAsyncComponent(() => import("primevue/datepicker")),
                    matchMode: this.getMatchMode("BETWEEN"),
                    bind: {
                      dateFormat: "dd/mm/yy",
                      numberOfMonths: 1,
                      selectionMode: "range",
                      manualInput: false,
                      monthNavigator: true,
                      hideOnRangeSelection: true,
                      showButtonBar: true,
                    },
                },
            }
        })
    }
}

const TableServices = new TableHelper();

export default TableServices;