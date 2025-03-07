const functions = require('firebase-functions');
const admin = require('firebase-admin');
const serviceAccount = require('./aditi-canteen-firebase-adminsdk-9y0ai-14293914d6.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

exports.validateVesEmail = functions.auth
  .user()
  .beforeCreate((user, context) => {
    if (!user.email || !user.email.includes('@siesgst.ac.in')) {
      throw new functions.auth.HttpsError(
        'invalid-argument',
        `Unauthorized email "${user.email}"`
      );
    }
  });

exports.storeUserDataAfterSignup = functions.auth
  .user()
  .onCreate(async user => {
    const { email, displayName, photoURL, uid, metadata } = user;
    try {
      const docRef = await db.collection('users').doc(uid).set({
        uid,
        displayName,
        email,
        photoURL,
        creationTime: metadata.creationTime,
        wallet: 1000,
      });

      console.log(`doc with id: ${docRef}`);
    } catch (error) {
      throw new functions.auth.HttpsError(
        'signup-data-error',
        'Failed to store signup data'
      );
    }
  });
