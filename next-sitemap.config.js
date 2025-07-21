/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://store.herbolife.in',          // ✅ Main domain
  generateRobotsTxt: true,                        // ✅ Generate /robots.txt
  generateIndexSitemap: true,                     // ✅ Include sitemap.xml as index
  changefreq: 'daily',                            // ✅ Preferred crawl frequency
  priority: 0.7,                                   // ✅ Default priority for pages
  sitemapSize: 5000,                              // ✅ Max entries per sitemap
  exclude: [
    '/admin',
    '/admin/*',                                    // ✅ Full admin exclusion
    '/api/*',                                      // ✅ Full API exclusion
  ],
  transform: async (config, path) => {
    if (/\.(xml|json)$/.test(path)) return null;   // ✅ Exclude .xml, .json files

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
        allow: '/',                                // ✅ Allow public crawling
        disallow: ['/admin', '/admin/*', '/api', '/api/*'], // ✅ Disallow all admin/api
      },
    ],
    additionalSitemaps: [
      'https://store.herbolife.in/server-sitemap.xml',  // ✅ Firestore-based dynamic sitemap
    ],
  },
};
