// navbar.js

document.addEventListener('DOMContentLoaded', function () {
    const navbar = document.getElementById('navbar');

    const navHTML = `
    <nav>
        <a href="index.html" class="nav-logo">Dashboard</a>
        <ul>
            <li><a href="weather.html">Weather</a></li>
            <li><a href="currency.html">Currency</a></li>
            <li><a href="myschedule.html">Schedule</a></li>
            <li><a href="news.html">News</a></li>
            <li class="login-signup">
                <a href="#" id="login-link">Login</a>
                <a href="#" id="signin-link">Sign Up</a>
                <a href="#" id="profile-link" style="display:none;">Profile</a> <!-- Moved inside .login-signup -->
            </li>
        </ul>
        <div class="hamburger" aria-label="Toggle navigation menu" role="button" tabindex="0">
            <span class="bar"></span>
            <span class="bar"></span>
            <span class="bar"></span>
        </div>
    </nav>
    `;

    navbar.innerHTML = navHTML;

    // Define the modals as a string (existing code)
    const modalHTML = `
    <!-- Login Modal -->
    <div id="login-modal" class="modal">
        <div class="modal-content">
            <span class="close" data-modal="login-modal">&times;</span>
            <h2>Login</h2>
            <form id="login-form">
                <label for="login-email">Email:</label>
                <input type="email" id="login-email" required>
                <label for="login-password">Password:</label>
                <input type="password" id="login-password" required>
                <button type="submit">Login</button>
            </form>
        </div>
    </div>
    <!-- Signup Modal -->
    <div id="signup-modal" class="modal">
        <div class="modal-content">
            <span class="close" data-modal="signup-modal">&times;</span>
            <h2>Sign Up</h2>
            <form id="signup-form">
                <label for="signup-username">Username:</label>
                <input type="text" id="signup-username" required>
                <label for="signup-email">Email:</label>
                <input type="email" id="signup-email" required>
                <label for="signup-password">Password:</label>
                <input type="password" id="signup-password" required>
                <button type="submit">Sign Up</button>
            </form>
        </div>
    </div>
    <!-- Profile Modal -->
    <div id="profile-modal" class="modal" style="display:none;">
        <div class="modal-content">
            <span class="close" id="close-profile-modal">&times;</span>
            <h2>Your Profile</h2>
            <p><strong>Username:</strong> <span id="profile-modal-username"></span></p>
            <p><strong>Email:</strong> <span id="profile-modal-email"></span></p>
            <button id="logout-button">Log Out</button>
        </div>
    </div>
    `;

    // Insert the modals into the body
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Dispatch an event to signal that modals are loaded
    document.dispatchEvent(new Event('modalsLoaded'));

    // Event listeners for modal functionality (existing code)
    document.getElementById('login-link').addEventListener('click', function(event) {
        event.preventDefault(); // Prevent default anchor click behavior
        showModal('login-modal');
    });

    document.getElementById('signin-link').addEventListener('click', function(event) {
        event.preventDefault(); // Prevent default anchor click behavior
        showModal('signup-modal');
    });

    // Close modals when clicking on the close button
    document.querySelectorAll('.close').forEach(closeButton => {
        closeButton.addEventListener('click', function() {
            const modalId = this.getAttribute('data-modal') || this.id.replace('close-', '');
            closeModal(modalId);
        });
    });

    // Close modals when clicking outside the modal content
    window.addEventListener('click', function(event) {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    });

    // Hamburger menu functionality
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('nav ul');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Optional: Close the menu when a link is clicked (for better UX)
    document.querySelectorAll('nav ul li a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
});

// Function to show a modal
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
    } else {
        console.error(`Modal with ID ${modalId} not found.`);
    }
}

// Function to close a specific modal
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    } else {
        console.error(`Modal with ID ${modalId} not found.`);
    }
}
