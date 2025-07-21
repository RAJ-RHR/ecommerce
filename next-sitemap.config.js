/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://store.herbolife.in',     // ✅ Your main site domain
  generateRobotsTxt: true,                   // ✅ Generate /robots.txt
  changefreq: 'daily',                       // ✅ Crawl frequency
  priority: 0.7,                             // ✅ Default priority
  sitemapSize: 5000,                         // ✅ Max URLs per sitemap chunk
  exclude: ['/admin', '/api/*'],             // ✅ Exclude backend routes
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',                          // ✅ Allow indexing of all public pages
        disallow: ['/admin', '/api'],        // ✅ Block sensitive routes
      },
    ],
    additionalSitemaps: [
      'https://store.herbolife.in/server-sitemap.xml', // ✅ Dynamic sitemap for Firestore-based routes
    ],
  },
};
