// ================================
// PETALSHOP — AUTH JAVASCRIPT
// Handles Login & Signup logic
// ================================

// ---- LOGIN FORM ----

// Get the login form element from the HTML
const loginForm = document.getElementById('loginForm');

// Check if loginForm exists on this page
// (this code runs on both login and signup pages)
if (loginForm) {

  // Listen for the form submit event
  loginForm.addEventListener('submit', function(event) {

    // Prevent the page from refreshing (default form behaviour)
    event.preventDefault();

    // Get what the user typed in the fields
    const email    = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const errorMsg = document.getElementById('errorMsg');

    // Basic validation — check fields are not empty
    if (email === '' || password === '') {
      errorMsg.textContent = '⚠️ Please fill in all fields.';
      errorMsg.classList.add('show');
      return; // Stop here, don't continue
    }

    // Check password is at least 6 characters
    if (password.length < 6) {
      errorMsg.textContent = '⚠️ Password must be at least 6 characters.';
      errorMsg.classList.add('show');
      return;
    }

    // ---- TEMPORARY: Simulate login (before backend is ready) ----
    // We will replace this with a real API call in May 11-20
    // For now, store user info in localStorage (browser storage)

    // Simple check — in real app, this comes from the database
    const savedUser = JSON.parse(localStorage.getItem('petalshop_user'));

    if (savedUser && savedUser.email === email && savedUser.password === password) {

      // Save login session
      localStorage.setItem('petalshop_loggedIn', 'true');
      localStorage.setItem('petalshop_currentUser', JSON.stringify(savedUser));

      // Check user role and redirect
      if (savedUser.role === 'admin') {
        window.location.href = '../pages/admin/dashboard.html';
      } else {
        window.location.href = '../pages/products.html';
      }

    } else {
      // Wrong credentials
      errorMsg.textContent = '❌ Invalid email or password. Please try again.';
      errorMsg.classList.add('show');
    }

  });
}