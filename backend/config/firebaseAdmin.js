const admin = require("firebase-admin");
const path = require("path");
const fs = require("fs");

function getFirebaseCredential() {
  // 1. Check if full JSON string is passed in environment variable
  const rawEnv = process.env.FIREBASE_SERVICE_ACCOUNT || process.env.FIREBASE_SERVICE_ACCOUNT_KEY || process.env.FIREBASE_CONFIG_JSON;
  if (rawEnv) {
    try {
      // support base64 encoded JSON or raw JSON
      const parsed = rawEnv.trim().startsWith("{") ? JSON.parse(rawEnv) : JSON.parse(Buffer.from(rawEnv, "base64").toString("utf-8"));
      return admin.credential.cert(parsed);
    } catch (err) {
      console.warn("⚠️ Failed to parse FIREBASE_SERVICE_ACCOUNT from env:", err.message);
    }
  }

  // 2. Check if local serviceAccountKey.json file exists
  const localKeyPath = path.join(__dirname, "../serviceAccountKey.json");
  if (fs.existsSync(localKeyPath)) {
    try {
      const fileData = JSON.parse(fs.readFileSync(localKeyPath, "utf-8"));
      return admin.credential.cert(fileData);
    } catch (err) {
      console.warn("⚠️ Failed to read local serviceAccountKey.json:", err.message);
    }
  }

  // 3. Fallback to Application Default Credentials
  try {
    return admin.credential.applicationDefault();
  } catch (err) {
    console.warn("⚠️ No Firebase credentials found. Running in unauthenticated / mock mode.");
    return null;
  }
}

if (!admin.apps.length) {
  const credential = getFirebaseCredential();
  const initOptions = {
    databaseURL: process.env.FIREBASE_DATABASE_URL || "https://tdschecker-e52d6-default-rtdb.asia-southeast1.firebasedatabase.app",
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "livetdsbucket"
  };

  if (credential) {
    initOptions.credential = credential;
  }

  admin.initializeApp(initOptions);
}

const db = admin.database();
let bucket = null;
try {
  bucket = admin.storage().bucket(process.env.FIREBASE_STORAGE_BUCKET || "livetdsbucket");
} catch (e) {
  console.warn("Firebase Storage bucket initialization skipped:", e.message);
}

module.exports = { admin, db, bucket, getFirebaseCredential };
