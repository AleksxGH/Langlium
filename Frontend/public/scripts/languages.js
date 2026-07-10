export const LANGUAGES = [
    { code: 'en', name: 'English', countryCode: 'gb' },
    { code: 'ru', name: 'Русский', countryCode: 'ru' },
    { code: 'uk', name: 'Українська', countryCode: 'ua' },
    { code: 'ro', name: 'Română', countryCode: 'ro' },
];

export function flagUrl(countryCode, width = '256x192') {
    return `https://flagcdn.com/${width}/${countryCode}.png`;
}