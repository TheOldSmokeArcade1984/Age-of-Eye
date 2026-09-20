/**
 * AGE OF EYE 1984 - GLOBAL PROGRESSION + LANGUAGE
 * Stato unificato di moduli e lingua su tutte le schermate.
 */
const AOE_PROGRESS = {
    STORAGE_KEY: 'ageOfEye_progress',
    LANG_KEY: 'ageOfEye_lang',
    LANG_LEGACY_KEY: 'sa-lang',
    LANGS: ['it', 'en', 'es', 'fr', 'de', 'ja', 'zh'],

    get: function() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            if (data) return JSON.parse(data);
        } catch (e) {
            console.warn("Errore di lettura storage:", e);
        }
        return {
            version: 1,
            knight: false,
            memory: false,
            sector: false,
            coreUnlocked: false,
            epilogueSeen: false
        };
    },

    save: function(data) {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
        } catch (e) {
            console.warn("Errore di scrittura storage:", e);
        }
    },

    markComplete: function(moduleKey) {
        const data = this.get();
        if (data[moduleKey] !== undefined) {
            data[moduleKey] = true;
            if (data.knight && data.memory && data.sector) {
                data.coreUnlocked = true;
                console.log("CRITICAL: THE CORE IS NOW UNLOCKED.");
            }
            this.save(data);
        }
    },

    isCoreUnlocked: function() {
        return this.get().coreUnlocked;
    },

    browserLang: function() {
        const sys = String(navigator.language || navigator.userLanguage || 'en')
            .substring(0, 2)
            .toLowerCase();
        return this.LANGS.includes(sys) ? sys : 'en';
    },

    /**
     * Lingua globale. Se la pagina non ha i testi per il codice salvato,
     * restituisce un fallback di display senza sovrascrivere la scelta.
     */
    getLang: function(supported) {
        const allowed = Array.isArray(supported) && supported.length ? supported : this.LANGS;
        let saved = null;
        try {
            saved = localStorage.getItem(this.LANG_KEY) || localStorage.getItem(this.LANG_LEGACY_KEY);
        } catch (e) {}

        if (!saved || !this.LANGS.includes(saved)) {
            saved = this.browserLang();
            this.setLang(saved);
        }

        let display = saved;
        if (!allowed.includes(saved)) {
            display = allowed.includes('en') ? 'en' : allowed[0];
        }
        try { document.documentElement.lang = display; } catch (e) {}
        return display;
    },

    setLang: function(code) {
        const lang = this.LANGS.includes(code) ? code : 'en';
        try {
            localStorage.setItem(this.LANG_KEY, lang);
            localStorage.setItem(this.LANG_LEGACY_KEY, lang);
        } catch (e) {}
        try {
            document.documentElement.lang = lang;
        } catch (e) {}
        return lang;
    }
};
