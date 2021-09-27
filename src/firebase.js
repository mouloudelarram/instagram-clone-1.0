import firebase from 'firebase'

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBGpDHImgtVa1WEu0gEMX4qrmSG0dr7yZ0",
    authDomain: "instagram-clone-753e1.firebaseapp.com",
    projectId: "instagram-clone-753e1",
    storageBucket: "instagram-clone-753e1.appspot.com",
    messagingSenderId: "410583082170",
    appId: "1:410583082170:web:0bf5bc2fdff84df73a0e83",
    measurementId: "G-ZMZWD0CGF0"
  };

const firebaseApp = firebase.initializeApp(firebaseConfig); 
const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };