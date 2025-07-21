/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://store.herbolife.in',             // ✅ Main domain for store
  generateRobotsTxt: true,                           // ✅ Generate /robots.txt
  generateIndexSitemap: true,                        // ✅ Default sitemap.xml acts as index
  changefreq: 'daily',                               // ✅ Daily crawl suggestion
  priority: 0.7,                                      // ✅ Default page priority
  sitemapSize: 5000,                                 // ✅ Max entries per chunk
  exclude: [
    '/admin',
    '/admin/*',
    '/api/*',
  ],
  transform: async (config, path) => {
    if (/\.(xml|json)$/.test(path)) return null;     // ✅ Skip sitemap and JSON paths
    return {
      loc: path,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: new Date().toISOString(),
    };
  },
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/admin/*', '/api', '/api/*'],
      },
    ],
    additionalSitemaps: [
      'https://store.herbolife.in/server-sitemap.xml', // ✅ Firestore-generated sitemap
    ],
  },
};
