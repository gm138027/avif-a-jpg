const { siteUrl, locales, defaultLocale, buildLocalePath } = require('./lib/siteConfig');
const localePattern = new RegExp(`^/(${locales.join('|')})(/|$)`);

const buildAlternateRefs = (normalizedPath) => ([
  ...locales.map(locale => ({
    href: buildLocalePath(locale, normalizedPath),
    hreflang: locale,
    hrefIsAbsolute: true
  })),
  {
    hreflang: 'x-default',
    href: buildLocalePath(defaultLocale, normalizedPath),
    hrefIsAbsolute: true
  }
]);

const normalizePath = (path = '/') => {
  const localeMatch = path.match(localePattern);

  if (localeMatch) {
    const localeInPath = localeMatch[1];
    const prefixLength = localeMatch[0].length;
    let remainder = path.slice(prefixLength);
    if (!remainder.startsWith('/')) {
      remainder = `/${remainder}`;
    }

    if (remainder === '') {
      remainder = '/';
    }

    return { normalizedPath: remainder, locale: localeInPath };
  }

  return { normalizedPath: path || '/', locale: defaultLocale };
};

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl,
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [{ userAgent: '*', allow: '/' }]
  },
  sitemapSize: 7000,
  outDir: 'public',
  transform: async (config, path) => {
    const { normalizedPath, locale } = normalizePath(path);

    // Exclude error pages from sitemap across all locales.
    if (normalizedPath === '/404' || normalizedPath === '/500') {
      return null;
    }

    const changefreq = normalizedPath.includes('/privacy') || normalizedPath.includes('/terms') || normalizedPath.includes('/contact') ? 'monthly' : 'weekly';
    const priority = normalizedPath === '/' ? 1.0 : normalizedPath.includes('/contact') ? 0.5 : normalizedPath.includes('/privacy') || normalizedPath.includes('/terms') ? 0.3 : 0.8;

    return {
      loc: buildLocalePath(locale, normalizedPath),
      changefreq,
      priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      alternateRefs: buildAlternateRefs(normalizedPath),
    };
  },
};
