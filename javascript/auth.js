// auth.js

// Import the Firebase app from firebaseConfig.js
import app from './firebaseConfig.js';

import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

import {
    getDatabase,
    ref,
    set,
    get
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

// Initialize Firebase services using the shared app instance
const auth = getAuth(app);
const database = getDatabase(app);

// Wait for the modals to be loaded
document.addEventListener('modalsLoaded', function() {
    // Attach event listeners that require the modals
    attachEventListeners();
});

// Function to attach event listeners
function attachEventListeners() {
    // Event listener for the signup form submission
    document.getElementById('signup-form').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission

        const username = document.getElementById('signup-username').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;

        // Sign up the user
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                writeUserData(user.uid, username, email);
                closeModal(); // Close the signup modal
                updateUI(user); // Update the UI for the logged-in user
            })
            .catch((error) => {
                console.error('Error signing up:', error.code, error.message);
                alert(error.message); // Display error message to the user
            });
    });

    // Event listener for the login form submission
    document.getElementById('login-form').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission

        const email = document.getElementById('login-email').value; // Use email for login
        const password = document.getElementById('login-password').value;

        // Log in the user using email and password
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log('User logged in:', user);
                closeModal(); // Close the login modal
                updateUI(user); // Update the UI for the logged-in user
            })
            .catch((error) => {
                console.error('Error logging in:', error.code, error.message);
                alert(error.message); // Display error message to the user
            });
    });

    // Event listener for the profile link
    document.getElementById('profile-link').addEventListener('click', function(event) {
        event.preventDefault(); // Prevent default anchor click behavior
        const user = auth.currentUser;
        if (user) {
            displayProfile(user.uid); // Show profile modal with user data
            showProfileModal(); // Show the profile modal
        }
    });

    // Event listener for the close button in the profile modal
    document.getElementById('close-profile-modal').addEventListener('click', closeProfileModal);

    // Event listener for the logout button
    document.getElementById('logout-button').addEventListener('click', function() {
        signOut(auth).then(() => {
            resetUI(); // Reset UI on logout
            closeProfileModal(); // Close the profile modal
        }).catch((error) => {
            console.error('Error logging out:', error);
        });
    });
}

// Listen for authentication state changes
onAuthStateChanged(auth, (user) => {
    if (user) {
        updateUI(user); // User is signed in
    } else {
        resetUI(); // User is signed out
    }
});

// Function to write user data to your Realtime Database
function writeUserData(userId, username, email) {
    set(ref(database, 'users/' + userId), {
        username: username,
        email: email
    })
    .then(() => {
        console.log("User data saved successfully.");
    })
    .catch((error) => {
        console.error("Error saving user data:", error);
    });
}

// Function to update the UI when the user is logged in
function updateUI(user) {
    document.getElementById('login-link').style.display = 'none'; // Hide login link
    document.getElementById('signin-link').style.display = 'none'; // Hide sign up link
    document.getElementById('profile-link').style.display = 'block'; // Show profile link
}

// Function to display profile information
function displayProfile(userId) {
    get(ref(database, 'users/' + userId))
        .then((snapshot) => {
            if (snapshot.exists()) {
                const userData = snapshot.val();
                document.getElementById('profile-modal-username').innerText = userData.username;
                document.getElementById('profile-modal-email').innerText = userData.email;
            }
        })
        .catch((error) => {
            console.error('Error retrieving profile data:', error);
        });
}

// Function to show the profile modal
function showProfileModal() {
    const modal = document.getElementById('profile-modal');
    if (modal) {
        modal.style.display = 'block';
    } else {
        console.error('Profile modal not found in the DOM.');
    }
}

// Function to close the profile modal
function closeProfileModal() {
    const modal = document.getElementById('profile-modal');
    if (modal) {
        modal.style.display = 'none';
    } else {
        console.error('Profile modal not found in the DOM.');
    }
}

// Function to reset the UI when the user is logged out
function resetUI() {
    document.getElementById('login-link').style.display = 'block'; // Show login link
    document.getElementById('signin-link').style.display = 'block'; // Show sign up link
    document.getElementById('profile-link').style.display = 'none'; // Hide profile link
}

// Function to close all modals
function closeModal() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.style.display = 'none';
    });
}
