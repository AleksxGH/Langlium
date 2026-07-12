export const LANGUAGES = [
    // Европейские
    { code: 'en', name: 'English', countryCode: 'gb' },
    { code: 'ru', name: 'Русский', countryCode: 'ru' },
    { code: 'uk', name: 'Українська', countryCode: 'ua' },
    { code: 'ro', name: 'Română', countryCode: 'ro' },
    { code: 'es', name: 'Español', countryCode: 'es' },
    { code: 'fr', name: 'Français', countryCode: 'fr' },
    { code: 'de', name: 'Deutsch', countryCode: 'de' },
    { code: 'it', name: 'Italiano', countryCode: 'it' },
    { code: 'pt', name: 'Português', countryCode: 'pt' },
    { code: 'nl', name: 'Nederlands', countryCode: 'nl' },
    { code: 'pl', name: 'Polski', countryCode: 'pl' },
    { code: 'cs', name: 'Čeština', countryCode: 'cz' },
    { code: 'sk', name: 'Slovenčina', countryCode: 'sk' },
    { code: 'sv', name: 'Svenska', countryCode: 'se' },
    { code: 'no', name: 'Norsk', countryCode: 'no' },
    { code: 'da', name: 'Dansk', countryCode: 'dk' },
    { code: 'fi', name: 'Suomi', countryCode: 'fi' },
    { code: 'el', name: 'Ελληνικά', countryCode: 'gr' },
    { code: 'hu', name: 'Magyar', countryCode: 'hu' },
    { code: 'bg', name: 'Български', countryCode: 'bg' },
    { code: 'sr', name: 'Српски', countryCode: 'rs' },
    { code: 'hr', name: 'Hrvatski', countryCode: 'hr' },
    { code: 'tr', name: 'Türkçe', countryCode: 'tr' },
    { code: 'ca', name: 'Català', countryCode: 'es' },

    // Азиатские
    { code: 'zh', name: '中文', countryCode: 'cn' },
    { code: 'ja', name: '日本語', countryCode: 'jp' },
    { code: 'ko', name: '한국어', countryCode: 'kr' },
    { code: 'hi', name: 'हिन्दी', countryCode: 'in' },
    { code: 'th', name: 'ไทย', countryCode: 'th' },
    { code: 'vi', name: 'Tiếng Việt', countryCode: 'vn' },
    { code: 'id', name: 'Bahasa Indonesia', countryCode: 'id' },
    { code: 'ms', name: 'Bahasa Melayu', countryCode: 'my' },
];

export function flagUrl(countryCode, width = '256x192') {
    return `https://flagcdn.com/${width}/${countryCode}.png`;
}

const STORAGE_KEY = 'userLanguages';
const CURRENT_KEY = 'currentLanguage';

export function getUserLanguages() {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
}

export function addUserLanguage(code) {
    const current = getUserLanguages();
    if (!current.includes(code)) {
        current.push(code);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
    }
    setCurrentLanguage(code);
}

export function getCurrentLanguage() {
    return localStorage.getItem(CURRENT_KEY);
}

export function setCurrentLanguage(code) {
    localStorage.setItem(CURRENT_KEY, code);
    window.dispatchEvent(new CustomEvent('language-changed', { detail: { code } }));
}