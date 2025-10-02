const baseUrl = process.env.SITEMAP_BASE_URL || 'https://avifajpg.com';

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: baseUrl,
  generateRobotsTxt: true,
  sitemapSize: 7000,
  outDir: 'public',
  transform: async (config, path) => {
    return {
      loc: path,
      changefreq: path.includes('/privacy') || path.includes('/terms') || path.includes('/contact') ? 'monthly' : 'weekly',
      priority: path === '/' ? 1.0 : path.includes('/contact') ? 0.5 : path.includes('/privacy') || path.includes('/terms') ? 0.3 : 0.8,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    };
  },
};