/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://store.herbolife.in',          // ✅ Main domain
  generateRobotsTxt: true,                        // ✅ Generates /robots.txt
  changefreq: 'daily',                            // ✅ Good for frequently updated site
  priority: 0.7,                                  // ✅ Moderate crawl priority
  sitemapSize: 5000,                              // ✅ Handles large sites
  exclude: ['/admin', '/api/*'],                  // ✅ Exclude private routes
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',                               // ✅ Allow all crawlers
        disallow: ['/admin', '/api'],             // ✅ Protect backend/admin
      },
    ],
    additionalSitemaps: [
      'https://store.herbolife.in/server-sitemap.xml',  // ✅ Dynamic sitemap for blog, products, categories
    ],
  },
};
