const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://avifajpg.com';
const locales = ['es', 'en', 'fr'];
const defaultLocale = 'es';

const localeMeta = {
  es: {
    inLanguage: 'es-ES',
    ogLocale: 'es_ES',
    dateLocale: 'es-ES',
    homeLabel: 'Inicio'
  },
  en: {
    inLanguage: 'en-US',
    ogLocale: 'en_US',
    dateLocale: 'en-US',
    homeLabel: 'Home'
  },
  fr: {
    inLanguage: 'fr-FR',
    ogLocale: 'fr_FR',
    dateLocale: 'fr-FR',
    homeLabel: 'Accueil'
  }
};

const normalizePath = (path = '/') => {
  if (!path || path === '') {
    return '/';
  }
  return path.startsWith('/') ? path : `/${path}`;
};

const buildLocalePath = (locale, path = '/') => {
  const normalized = normalizePath(path);
  const suffix = normalized === '/' ? '' : normalized;
  return locale === defaultLocale ? `${siteUrl}${suffix}` : `${siteUrl}/${locale}${suffix}`;
};

const getLocaleMeta = (locale = defaultLocale) => {
  return localeMeta[locale] || localeMeta[defaultLocale];
};

module.exports = {
  siteUrl,
  locales,
  defaultLocale,
  buildLocalePath,
  getLocaleMeta
};