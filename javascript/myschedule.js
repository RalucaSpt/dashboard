
// Import the Firebase app from firebaseConfig.js
import app from './firebaseConfig.js';

import {
  getDatabase,
  ref,
  onValue,
  push,
  remove,
} from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js';

import {
  getAuth,
  onAuthStateChanged,
} from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js';

// Initialize Firebase services using the shared app instance
const db = getDatabase(app);
const auth = getAuth(app);

let userId = null;
let eventsRef = null;
let eventsArr = {};

// Wait for authentication state to change
onAuthStateChanged(auth, (user) => {
  if (user) {
    userId = user.uid;
    eventsRef = ref(db, `users/${userId}/events`);
    getUserEvents();
    initCalendar();
  } else {
    console.log("No user is signed in.");
    // Optionally, redirect to login page
    // window.location.href = 'login.html';
  }
});

// Fetch events from Firebase
function getUserEvents() {
  if (!eventsRef) return;
  onValue(eventsRef, (snapshot) => {
    eventsArr = snapshot.val() || {};
    initCalendar();
  });
}

// DOM Elements
const calendar = document.querySelector(".calendar"),
  date = document.querySelector(".date"),
  daysContainer = document.querySelector(".days"),
  prev = document.querySelector(".prev"),
  next = document.querySelector(".next"),
  todayBtn = document.querySelector(".today-btn"),
  gotoBtn = document.querySelector(".goto-btn"),
  monthInput = document.querySelector(".month-input"),
  yearInput = document.querySelector(".year-input"),
  eventDay = document.querySelector(".event-day"),
  eventDate = document.querySelector(".event-date"),
  eventsContainer = document.querySelector(".events"),
  toggleEventBtn = document.querySelector(".add-event"),
  addEventWrapper = document.querySelector(".add-event-wrapper"),
  addEventCloseBtn = document.querySelector(".close"),
  addEventBtn = document.querySelector(".add-event-btn"),
  addEventTitle = document.querySelector(".event-name"),
  addEventFrom = document.querySelector(".event-time-from"),
  addEventTo = document.querySelector(".event-time-to");

let today = new Date();
let activeDay = today.getDate();
let month = today.getMonth();
let year = today.getFullYear();

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

// Initialize the calendar
function initCalendar() {
  if (userId === null) return; // Ensure userId is available

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const prevLastDay = new Date(year, month, 0).getDate();
  const lastDate = lastDay.getDate();
  const day = firstDay.getDay();
  const nextDays = 7 - lastDay.getDay() - 1;

  date.innerHTML = `${months[month]} ${year}`;
  let days = "";

  for (let x = day; x > 0; x--) {
    days += `<div class="day prev-date">${prevLastDay - x + 1}</div>`;
  }

  for (let i = 1; i <= lastDate; i++) {
    const isToday = i === today.getDate() && month === today.getMonth() && year === today.getFullYear();
    const hasEvent = Object.values(eventsArr).some(event =>
      event.date.day === i && event.date.month === month + 1 && event.date.year === year
    );
    days += `<div class="day ${isToday ? 'today' : ''} ${hasEvent ? 'event' : ''}">${i}</div>`;
  }

  for (let j = 1; j <= nextDays; j++) {
    days += `<div class="day next-date">${j}</div>`;
  }

  daysContainer.innerHTML = days;
  addDayListeners();
}

// Add event listeners to the days
function addDayListeners() {
  document.querySelectorAll(".day").forEach(day => {
    day.addEventListener("click", (e) => {
      activeDay = Number(e.target.innerHTML);
      getActiveDay(activeDay);
      updateEvents(activeDay);
      document.querySelectorAll(".day").forEach(d => d.classList.remove("active"));
      e.target.classList.add("active");
    });
  });
}

// Add new event to Firebase
addEventBtn.addEventListener('click', () => {
  const eventName = addEventTitle.value;
  const hourFrom = addEventFrom.value;
  const hourTo = addEventTo.value;

  if (!eventName || !hourFrom || !hourTo) {
    displayWarning("Please fill all fields.");
    return;
  }

  if (hourTo <= hourFrom) {
    displayWarning("End time must be later than start time.");
    return;
  }

  const newEvent = {
    date: { day: activeDay, month: month + 1, year: year },
    details: { eventName, hourFrom, hourTo }
  };

  push(eventsRef, newEvent).then(() => {
    console.log("New event added successfully!");
    clearWarning();
    getUserEvents();
    updateEvents(activeDay);
  });
});

function displayWarning(message) {
  const warningMessage = document.querySelector(".warning-message");
  warningMessage.textContent = message;
  warningMessage.style.display = "block";
}

function clearWarning() {
  const warningMessage = document.querySelector(".warning-message");
  warningMessage.style.display = "none";
}

// Navigate months
function changeMonth(offset) {
  month += offset;
  if (month < 0) { month = 11; year--; }
  if (month > 11) { month = 0; year++; }
  initCalendar();
}

prev.addEventListener('click', () => changeMonth(-1));
next.addEventListener('click', () => changeMonth(1));
todayBtn.addEventListener('click', () => {
  today = new Date();
  month = today.getMonth();
  year = today.getFullYear();
  getActiveDay(today.getDate());
  updateEvents(today.getDate());
  initCalendar();
});

gotoBtn.addEventListener('click', gotoDate);

function gotoDate() {
  const inputMonth = parseInt(monthInput.value);
  const inputYear = parseInt(yearInput.value);
  if (inputMonth >= 1 && inputMonth <= 12 && inputYear > 0 && inputYear < 9999) {
    month = inputMonth - 1;
    year = inputYear;
    initCalendar();
    clearWarning();
  } else {
    displayWarning("Invalid date. Enter a month (1-12) and a valid year.");
  }
}

// Display active day's name and date
function getActiveDay(date) {
  const dayName = new Date(year, month, date).toString().split(" ")[0];
  eventDay.innerHTML = dayName;
  eventDate.innerHTML = `${date} ${months[month]} ${year}`;
}

// Delete event from Firebase
function deleteEvent(eventId) {
  const eventPath = `users/${userId}/events/${eventId}`;
  remove(ref(db, eventPath)).then(() => {
    console.log("Event deleted successfully!");
    getUserEvents(); // Refresh events after deletion
    updateEvents(activeDay); // Update the events for the current day
  }).catch((error) => {
    console.error("Error deleting event:", error);
  });
}

// Update events for the selected day
function updateEvents(date) {
  let eventsHTML = Object.entries(eventsArr)
    .filter(([id, event]) => event.date.day === date && event.date.month === month + 1 && event.date.year === year)
    .map(([id, event]) => `
      <div class="event displayedEvent" data-id="${id}">
        <div class="title">
          <i class="fas fa-circle"></i>
          <h3 class="event-title">${event.details.eventName}</h3>
        </div>
        <div class="event-time">
          <span class="event-time">${event.details.hourFrom} - ${event.details.hourTo}</span>
        </div>
      </div>
    `).join("");

  if (eventsHTML === "") {
    eventsHTML = `<div class="no-event"><h3>No Events</h3></div>`;
  }
  eventsContainer.innerHTML = eventsHTML;

  // Add click event to each event for deletion
  document.querySelectorAll(".displayedEvent").forEach(eventElement => {
    eventElement.addEventListener("click", () => {
      const eventId = eventElement.getAttribute("data-id");
      if (confirm("Are you sure you want to delete this event?")) {
        deleteEvent(eventId);
      }
    });
  });
}

// Function to toggle event form
toggleEventBtn.addEventListener("click", () => {
  addEventWrapper.classList.add("active");
});

addEventCloseBtn.addEventListener("click", () => {
  addEventWrapper.classList.remove("active");
});

document.addEventListener("click", (e) => {
  if (!toggleEventBtn.contains(e.target) && !addEventWrapper.contains(e.target)) {
    addEventWrapper.classList.remove("active");
  }
});
