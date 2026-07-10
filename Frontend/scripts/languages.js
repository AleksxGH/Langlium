export const LANGUAGES = [
    // { code: 'es', name: 'Испанский', countryCode: 'es' },
    // { code: 'fr', name: 'Французский', countryCode: 'fr' },
    // { code: 'de', name: 'Немецкий', countryCode: 'de' },
    { code: 'en', name: 'English', countryCode: 'gb' },
    { code: 'ru', name: 'Русский', countryCode: 'ru' },
    { code: 'uk', name: 'Українська', countryCode: 'ua' },
    { code: 'ro', name: 'Română', countryCode: 'ro' },
];

export function flagUrl(countryCode, width = '256x192') {
    return `https://flagcdn.com/${width}/${countryCode}.png`;
}