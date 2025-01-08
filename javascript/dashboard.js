// dashboard.js

import app from './firebaseConfig.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js';
import { getDatabase, ref, onValue } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js';

const auth = getAuth(app);
const database = getDatabase(app);

// DOM Elements
const todayEventsSection = document.getElementById('today-events-section');
const todayEventsContainer = document.getElementById('today-events-container');

// Get today's date
const today = new Date();
const day = today.getDate();
const month = today.getMonth() + 1; // Months are zero-indexed
const year = today.getFullYear();

// Listen for authentication state changes
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in
        fetchTodayEvents(user.uid);
    } else {
        // User is signed out
        todayEventsSection.style.display = 'none';
    }
});

// Function to fetch today's events for the logged-in user
function fetchTodayEvents(userId) {
    const eventsRef = ref(database, `users/${userId}/events`);

    onValue(eventsRef, (snapshot) => {
        const eventsData = snapshot.val();
        if (eventsData) {
            // Filter events for today
            const todayEvents = Object.values(eventsData).filter(event => {
                return event.date.day === day && event.date.month === month && event.date.year === year;
            });

            if (todayEvents.length > 0) {
                displayTodayEvents(todayEvents);
                todayEventsSection.style.display = 'block';
            } else {
                displayNoEventsMessage();
                todayEventsSection.style.display = 'block';
            }
        } else {
            displayNoEventsMessage();
            todayEventsSection.style.display = 'block';
        }
    }, (error) => {
        console.error('Error fetching events:', error);
    });
}

// Function to display today's events
function displayTodayEvents(events) {
    todayEventsContainer.innerHTML = ''; // Clear previous events

    events.forEach(event => {
        const eventElement = document.createElement('div');
        eventElement.classList.add('event-item');

        eventElement.innerHTML = `
            <h3>${event.details.eventName}</h3>
            <p><strong>Time:</strong> ${event.details.hourFrom} - ${event.details.hourTo}</p>
        `;

        todayEventsContainer.appendChild(eventElement);
    });
}

// Function to display a message when there are no events
function displayNoEventsMessage() {
    todayEventsContainer.innerHTML = '<p>You have no events scheduled for today.</p>';
}
