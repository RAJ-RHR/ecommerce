const https = require('https');

const sitemaps = [
  'https://store.herbolife.in/sitemap.xml',
  'https://store.herbolife.in/server-sitemap.xml',
];

const engines = {
  google: 'https://www.google.com/ping?sitemap=',
  bing: 'https://www.bing.com/ping?sitemap=',
};

function waitForSitemap(url, retries = 10, delay = 5000) {
  return new Promise((resolve, reject) => {
    const attempt = (count) => {
      https.get(url, (res) => {
        if (res.statusCode === 200) {
          console.log(`✅ Sitemap ready: ${url}`);
          resolve();
        } else {
          if (count < retries) {
            console.log(`⏳ Waiting for sitemap (${count}/${retries}): ${url}`);
            setTimeout(() => attempt(count + 1), delay);
          } else {
            reject(new Error(`❌ Sitemap not available: ${url}`));
          }
        }
      }).on('error', (err) => {
        if (count < retries) {
          console.log(`⏳ Retry due to error (${count}/${retries}): ${url}`);
          setTimeout(() => attempt(count + 1), delay);
        } else {
          reject(err);
        }
      });
    };

    attempt(1);
  });
}

function pingSitemapToEngines(sitemap) {
  Object.entries(engines).forEach(([name, base]) => {
    const url = `${base}${encodeURIComponent(sitemap)}`;
    https.get(url, (res) => {
      console.log(`[${name.toUpperCase()}] Pinged ${sitemap} – Status: ${res.statusCode}`);
    }).on('error', (err) => {
      console.error(`[${name.toUpperCase()}] Error pinging ${sitemap}: ${err.message}`);
    });
  });
}

(async () => {
  for (const sitemap of sitemaps) {
    try {
      await waitForSitemap(sitemap);
      pingSitemapToEngines(sitemap);
    } catch (err) {
      console.error(`❌ Skipping ping due to error: ${err.message}`);
    }
  }
})();
