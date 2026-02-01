const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://avifajpg.com';
const siteUrl = rawSiteUrl.replace(/\/+$/, '');
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
  let normalized = path.startsWith('/') ? path : `/${path}`;
  if (normalized !== '/' && normalized.endsWith('/')) {
    normalized = normalized.slice(0, -1);
  }
  return normalized;
};

const buildLocalePath = (locale, path = '/') => {
  const normalized = normalizePath(path);
  const suffix = normalized === '/' ? '' : normalized;
  const prefix = locale === defaultLocale ? '' : `/${locale}`;
  return `${siteUrl}${prefix}${suffix}`;
};

const buildLocaleHref = (locale, path = '/') => {
  const normalized = normalizePath(path);
  const suffix = normalized === '/' ? '' : normalized;
  if (locale === defaultLocale) {
    return suffix;
  }
  return `/${locale}${suffix}`;
};

const getLocaleMeta = (locale = defaultLocale) => {
  return localeMeta[locale] || localeMeta[defaultLocale];
};

module.exports = {
  siteUrl,
  locales,
  defaultLocale,
  buildLocalePath,
  buildLocaleHref,
  getLocaleMeta
};
