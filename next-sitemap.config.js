/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://store.herbolife.in', // ✅ Main domain
  generateRobotsTxt: true,               // ✅ Generates /robots.txt
  changefreq: 'daily',                   // ✅ Useful for SEO-crawled content
  priority: 0.7,                         // ✅ Decent priority
  sitemapSize: 5000,                     // ✅ Standard chunk size for large sites
  exclude: ['/admin', '/api/*'],         // ✅ Pages you want to exclude
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',                     // ✅ Allow all crawlers on the public site
        disallow: ['/admin', '/api'],   // ✅ Block sensitive/internal routes
      },
    ],
  },
};
