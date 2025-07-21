const https = require('https');

const sitemaps = [
  'https://store.herbolife.in/sitemap.xml',
  'https://store.herbolife.in/server-sitemap.xml'
];

const engines = {
  google: 'https://www.google.com/ping?sitemap=',
  bing: 'https://www.bing.com/ping?sitemap='
};

sitemaps.forEach((sitemap) => {
  Object.entries(engines).forEach(([name, base]) => {
    const url = `${base}${encodeURIComponent(sitemap)}`;
    https.get(url, (res) => {
      console.log(`[${name.toUpperCase()}] Pinged ${sitemap} – Status: ${res.statusCode}`);
    }).on('error', (err) => {
      console.error(`[${name.toUpperCase()}] Error pinging ${sitemap}: ${err.message}`);
    });
  });
});
