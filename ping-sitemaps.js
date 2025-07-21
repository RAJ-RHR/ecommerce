const https = require('https');

const sitemaps = [
  'https://store.herbolife.in/sitemap.xml',
  'https://store.herbolife.in/server-sitemap.xml',
];

function waitForSitemap(url, retries = 10, delay = 5000) {
  return new Promise((resolve, reject) => {
    const attempt = (count) => {
      https.get(url, (res) => {
        if (res.statusCode === 200) {
          console.log(`✅ Sitemap ready: ${url}`);
          resolve();
        } else if (res.statusCode === 404) {
          console.warn(`❌ Sitemap returned 404: ${url}`);
          reject(new Error('Sitemap not found (404)'));
        } else if (res.statusCode === 410) {
          console.warn(`🚫 Sitemap gone (410): ${url}`);
          reject(new Error('Sitemap no longer exists (410)'));
        } else {
          if (count < retries) {
            console.log(`⏳ Waiting for sitemap (${count}/${retries}) [${res.statusCode}]: ${url}`);
            setTimeout(() => attempt(count + 1), delay);
          } else {
            reject(new Error(`Sitemap failed after ${retries} attempts (Status: ${res.statusCode})`));
          }
        }
      }).on('error', (err) => {
        if (count < retries) {
          console.log(`⏳ Retry on error (${count}/${retries}): ${url}`);
          setTimeout(() => attempt(count + 1), delay);
        } else {
          reject(err);
        }
      });
    };

    attempt(1);
  });
}

// Main execution: Only wait for sitemaps, skip pinging
(async () => {
  for (const sitemap of sitemaps) {
    try {
      await waitForSitemap(sitemap);
    } catch (err) {
      console.error(`🚫 Skipping sitemap: ${sitemap} – ${err.message}`);
    }
  }

  console.log('✅ Skipped pinging. Sitemap status check complete.');
  process.exit(0); // ✅ Ensure Node exits
})();
