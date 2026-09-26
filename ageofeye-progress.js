/**
 * AGE OF EYE 1984 - GLOBAL PROGRESSION + LANGUAGE
 * Stato unificato di moduli, 12 nodi e lingua su tutte le schermate.
 * Hardened Storage & Unified Wipe.
 */
const AOE_PROGRESS = {
    STORAGE_KEY: 'ageOfEye_progress',
    LANG_KEY: 'ageOfEye_lang',
    LANG_LEGACY_KEY: 'sa-lang',
    LANGS: ['it', 'en', 'es', 'fr', 'de', 'ja', 'zh'],
    HUB_NODES: [
        'snake', 'pong', 'runner', 'dodge', 
        'breakout', 'racer', 'shooter', 'flappy', 
        'miner', 'orbit', 'stacker', 'memory'
    ],

    get: function() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            if (data) return JSON.parse(data);
        } catch (e) {
            console.warn("Errore di lettura storage:", e);
        }
        return { version: 1, knight: false, memory: false, sector: false, coreUnlocked: false, epilogueSeen: false };
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
                console.log("CRITICAL: MODULES COMPLETED. AWAITING HUB NODES VERIFICATION.");
            }
            this.save(data);
        }
    },

    areAllHubNodesCompleted: function() {
        try {
            for (let node of this.HUB_NODES) {
                let score = parseInt(localStorage.getItem('sa-hi-' + node) || '0', 10);
                if (isNaN(score) || score <= 0) return false;
            }
            return true;
        } catch (e) {
            return false;
        }
    },

    isCoreUnlocked: function() {
        const data = this.get();
        // Il nucleo richiede rigorosamente SIA i 3 moduli che i 12 nodi dell'hub
        return data.coreUnlocked && this.areAllHubNodesCompleted();
    },

    wipeAll: function() {
        try {
            // Salva la lingua prima del wipe totale per non tradire l'esperienza utente
            const currentLang = this.getLang(this.LANGS);
            
            // Pulisce radicalmente tutto il localStorage (cancella progressi, record e cache corrotta)
            localStorage.clear();
            
            // Ripristina la preferenza linguistica
            this.setLang(currentLang);
            console.log("SISTEMA FORMATTATO. LINGUA MANTENUTA.");
        } catch (e) {
            console.warn("Errore durante il wipe totale:", e);
        }
    },

    browserLang: function() {
        const sys = String(navigator.language || navigator.userLanguage || 'en').substring(0, 2).toLowerCase();
        return this.LANGS.includes(sys) ? sys : 'en';
    },

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
