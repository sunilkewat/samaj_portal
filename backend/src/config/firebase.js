const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

function getFirebaseCredential() {
  // 1. Check raw JSON string in environment variable (Render / Cloud deployment)
  const rawEnv = process.env.FIREBASE_SERVICE_ACCOUNT || process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (rawEnv) {
    try {
      const parsed = rawEnv.trim().startsWith('{') ? JSON.parse(rawEnv) : JSON.parse(Buffer.from(rawEnv, 'base64').toString('utf-8'));
      return admin.credential.cert(parsed);
    } catch (err) {
      console.warn('⚠️ Failed to parse FIREBASE_SERVICE_ACCOUNT from env:', err.message);
    }
  }

  // 2. Check custom key path from environment variable
  if (process.env.FIREBASE_KEY_PATH) {
    const customPath = path.resolve(process.cwd(), process.env.FIREBASE_KEY_PATH);
    if (fs.existsSync(customPath)) {
      try {
        const fileData = JSON.parse(fs.readFileSync(customPath, 'utf-8'));
        return admin.credential.cert(fileData);
      } catch (err) {
        console.warn(`⚠️ Failed to read file at ${customPath}:`, err.message);
      }
    }
  }

  // 3. Auto-discover any firebase-adminsdk*.json file inside backend/config
  const configDir = path.resolve(__dirname, '../../config');
  if (fs.existsSync(configDir)) {
    const files = fs.readdirSync(configDir);
    const jsonFile = files.find((f) => f.includes('firebase-adminsdk') && f.endsWith('.json'));
    if (jsonFile) {
      try {
        const filePath = path.join(configDir, jsonFile);
        const fileData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        console.log(`[Firebase] Loaded credentials from config/${jsonFile}`);
        return admin.credential.cert(fileData);
      } catch (err) {
        console.warn('⚠️ Error reading auto-discovered Firebase JSON:', err.message);
      }
    }
  }

  // 4. Fallback to Application Default Credentials
  try {
    return admin.credential.applicationDefault();
  } catch (err) {
    console.warn('⚠️ No Firebase credentials found. Running in unauthenticated / mock mode.');
    return null;
  }
}

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  const credential = getFirebaseCredential();
  const storageBucket = process.env.FIREBASE_STORAGE_BUCKET || 'livetdsbucket';

  const initOptions = {
    projectId: process.env.FIREBASE_PROJECT_ID || 'samaj-portal-sap',
    storageBucket,
  };

  if (credential) {
    initOptions.credential = credential;
  }

  admin.initializeApp(initOptions);
  console.log(`[Firebase] Initialized with bucket: ${storageBucket}`);
}

const auth = admin.auth();
const messaging = admin.messaging();

let bucket = null;
try {
  bucket = admin.storage().bucket(process.env.FIREBASE_STORAGE_BUCKET || 'livetdsbucket');
} catch (e) {
  console.warn('⚠️ Firebase Storage bucket initialization skipped:', e.message);
}

/**
 * Upload buffer to Firebase Cloud Storage (livetdsbucket)
 */
async function uploadToStorage(buffer, destinationPath, mimeType) {
  if (!bucket) throw new Error('Firebase Storage bucket is not available');

  const file = bucket.file(destinationPath);
  await file.save(buffer, {
    metadata: { contentType: mimeType },
    public: true,
  });

  // Make public or get signed URL
  return `https://storage.googleapis.com/${bucket.name}/${destinationPath}`;
}

/**
 * Send FCM Push Notification
 */
async function sendPushNotification(fcmToken, { title, body, data = {} }) {
  try {
    const message = {
      token: fcmToken,
      notification: { title, body },
      data,
    };
    const response = await messaging.send(message);
    return { success: true, messageId: response };
  } catch (error) {
    console.error('[FCM] Notification Send Error:', error.message);
    return { success: false, error: error.message };
  }
}

module.exports = {
  admin,
  auth,
  messaging,
  bucket,
  uploadToStorage,
  sendPushNotification,
};
