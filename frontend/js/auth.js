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

// ================================
// SIGNUP FORM LOGIC
// ================================

// Selected role — default is 'user' (customer)
let selectedRole = 'user';

// This function runs when user clicks Customer or Admin card
function selectRole(role) {
  selectedRole = role;

  // Update hidden input
  const roleInput = document.getElementById('selectedRole');
  if (roleInput) roleInput.value = role;

  // Update card styles
  const customerCard = document.getElementById('roleCustomer');
  const adminCard    = document.getElementById('roleAdmin');

  if (customerCard && adminCard) {
    if (role === 'user') {
      customerCard.classList.add('selected');
      adminCard.classList.remove('selected');
    } else {
      adminCard.classList.add('selected');
      customerCard.classList.remove('selected');
    }
  }
}

// Password strength checker
const passwordInput = document.getElementById('password');
if (passwordInput) {
  passwordInput.addEventListener('input', function () {
    const val = this.value;
    const bars  = [
      document.getElementById('bar1'),
      document.getElementById('bar2'),
      document.getElementById('bar3'),
      document.getElementById('bar4'),
    ];
    const label = document.getElementById('strengthLabel');

    // Reset all bars
    bars.forEach(b => { if(b) b.className = 'bar'; });

    if (val.length === 0) {
      if (label) label.textContent = '';
      return;
    }

    // Calculate strength score
    let score = 0;
    if (val.length >= 6)                        score++;  // min length
    if (val.length >= 10)                       score++;  // longer
    if (/[A-Z]/.test(val) && /[0-9]/.test(val)) score++;  // has uppercase + number
    if (/[^A-Za-z0-9]/.test(val))               score++;  // has special char

    // Apply bar colours based on score
    const colours = {
      1: ['weak'],
      2: ['medium', 'medium'],
      3: ['strong', 'strong', 'strong'],
      4: ['strong', 'strong', 'strong', 'strong'],
    };
    const labels = { 1: 'Weak password', 2: 'Fair password', 3: 'Good password', 4: 'Strong password 💪' };
    const labelColours = { 1: 'var(--red)', 2: 'var(--yellow-dark)', 3: '#16A34A', 4: '#16A34A' };

    const applied = colours[score] || [];
    applied.forEach((cls, i) => { if (bars[i]) bars[i].classList.add(cls); });
    if (label) {
      label.textContent = labels[score] || '';
      label.style.color = labelColours[score] || '';
    }
  });
}

// Confirm password checker
const confirmInput = document.getElementById('confirmPassword');
if (confirmInput) {
  confirmInput.addEventListener('input', function () {
    const hint = document.getElementById('confirmHint');
    if (!hint) return;
    if (this.value === passwordInput.value) {
      hint.textContent = '✓ Passwords match';
      hint.className = 'field-hint ok';
      this.classList.add('valid');
      this.classList.remove('invalid');
    } else {
      hint.textContent = '✗ Passwords do not match';
      hint.className = 'field-hint er';
      this.classList.add('invalid');
      this.classList.remove('valid');
    }
  });
}

// Email live validation
const emailInputSignup = document.getElementById('email');
if (emailInputSignup && document.getElementById('signupForm')) {
  emailInputSignup.addEventListener('input', function () {
    const hint = document.getElementById('emailHint');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!hint) return;
    if (emailRegex.test(this.value)) {
      hint.textContent = '✓ Valid email address';
      hint.className = 'field-hint ok';
      this.classList.add('valid');
      this.classList.remove('invalid');
    } else {
      hint.textContent = '✗ Please enter a valid email';
      hint.className = 'field-hint er';
      this.classList.add('invalid');
      this.classList.remove('valid');
    }
  });
}

// ---- SIGNUP FORM SUBMIT ----
const signupForm = document.getElementById('signupForm');

if (signupForm) {
  signupForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const firstName       = document.getElementById('firstName').value.trim();
    const lastName        = document.getElementById('lastName').value.trim();
    const email           = document.getElementById('email').value.trim();
    const password        = document.getElementById('password').value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value.trim();
    const termsChecked    = document.getElementById('terms').checked;
    const errorMsg        = document.getElementById('errorMsg');
    const role            = document.getElementById('selectedRole').value;

    // Clear previous errors
    errorMsg.classList.remove('show');

    // Validate all fields
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      errorMsg.textContent = '⚠️ Please fill in all fields.';
      errorMsg.classList.add('show');
      return;
    }

    if (password !== confirmPassword) {
      errorMsg.textContent = '⚠️ Passwords do not match.';
      errorMsg.classList.add('show');
      return;
    }

    if (password.length < 6) {
      errorMsg.textContent = '⚠️ Password must be at least 6 characters.';
      errorMsg.classList.add('show');
      return;
    }

    if (!termsChecked) {
      errorMsg.textContent = '⚠️ Please agree to the Terms of Service.';
      errorMsg.classList.add('show');
      return;
    }

    // Save user to localStorage (temporary — will use API later)
    const newUser = {
      firstName,
      lastName,
      name : firstName + ' ' + lastName,
      email,
      password,
      role,   // 'user' or 'admin'
    };

    localStorage.setItem('petalshop_user', JSON.stringify(newUser));
    localStorage.setItem('petalshop_loggedIn', 'true');
    localStorage.setItem('petalshop_currentUser', JSON.stringify(newUser));

    // Redirect based on role
    if (role === 'admin') {
      window.location.href = 'admin/dashboard.html';
    } else {
      window.location.href = 'products.html';
    }
  });
}