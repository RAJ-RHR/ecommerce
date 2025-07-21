/** @type {import('next-sitemap').IConfig} */
const path = require('path');

module.exports = {
  siteUrl: 'https://herbolife.in',
  generateRobotsTxt: true,
  generateIndexSitemap: false, // prevent default sitemap.xml
  changefreq: 'daily',
  priority: 0.7,
  sitemapSize: 5000,
  outDir: './public',
  exclude: ['/admin', '/admin/*', '/api/*'],
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
      'https://herbolife.in/main-server-sitemap.xml'
    ],
  },
};
