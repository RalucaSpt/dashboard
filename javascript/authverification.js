import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";


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

// Inițializează Firebase dacă nu a fost inițializat deja
if (!getApps().length) {
    initializeApp(firebaseConfig);
}

// Obține instanța de autentificare
const auth = getAuth();

// Verifică starea autentificării
onAuthStateChanged(auth, (user) => {
    if (user) {
        // Utilizatorul este autentificat
        document.getElementById('content').style.display = 'block';
    } else {
        // Utilizatorul nu este autentificat
        alert('Trebuie să fii autentificat pentru a accesa această pagină.');
        window.location.href = 'index.html'; // Redirecționează către pagina principală sau de login
    }
});
