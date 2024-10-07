import englishTranslations from '../../../public/locales/english.json';
import spanishTranslations from '../../../public/locales/spanish.json';

export function getTranslation(key: string, language: string = 'English'): string {
    const keys = key.split('.');
    let value: any = language === 'English' ? englishTranslations : spanishTranslations; // Replace with other language JSONs when available

    for (const k of keys) {
        if (value[k] === undefined) {
            console.warn(`Translation key "${key}" not found for language "${language}"`);
            return key;
        }
        value = value[k];
    }

    return value;
}