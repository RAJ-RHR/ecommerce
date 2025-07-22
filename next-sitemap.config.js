/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://store.herbolife.in',
  generateRobotsTxt: false, // ❌ Don't auto-generate robots.txt
  generateIndexSitemap: true,
  changefreq: 'daily',
  priority: 0.7,
  sitemapSize: 5000,
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
};
