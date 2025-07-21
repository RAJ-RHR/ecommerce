/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://herbolife.in',                     // ✅ Use herbolife.in
  generateRobotsTxt: true,
  generateIndexSitemap: true,
  changefreq: 'daily',
  priority: 0.7,
  sitemapSize: 5000,
  exclude: [
    '/admin',
    '/admin/*',
    '/api/*',
  ],
  transform: async (config, path) => {
    if (/\.(xml|json)$/.test(path)) return null;

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
      'https://herbolife.in/main-server-sitemap.xml',  // ✅ Firestore-based sitemap for herbolife.in
    ],
  },
};
