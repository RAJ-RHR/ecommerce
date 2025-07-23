// setAdmin.js
const admin = require('firebase-admin');

// Replace with path to your serviceAccountKey.json
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const uid = 'bWXFmXJhgScdYnCS8nGzhqnfmnC2'; // your UID

admin.auth().setCustomUserClaims(uid, { admin: true })
  .then(() => {
    console.log(`✅ Admin access granted to UID: ${uid}`);
  })
  .catch((error) => {
    console.error('❌ Error setting custom claims:', error);
  });
