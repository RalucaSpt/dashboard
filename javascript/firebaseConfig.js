// firebaseConfig.js

import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js';

// Your Firebase configuration object
const firebaseConfig = {
    apiKey: "AIzaSyDFk7xRYHYFPGl9xWygtAMDhkrL_b-tuqc",
    authDomain: "my-personal-dashboard-ebca3.firebaseapp.com",
    databaseURL: "https://my-personal-dashboard-ebca3-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "my-personal-dashboard-ebca3",
    storageBucket: "my-personal-dashboard-ebca3.appspot.com",
    messagingSenderId: "130007770974",
    appId: "1:130007770974:web:8d35e1599f0a5e0de8d1cf",
    measurementId: "G-5LR0QNMGP0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;
