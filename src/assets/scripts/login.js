// window.onload = function() {
//     const loginForm = document.getElementById('login-form');
    
//     loginForm.addEventListener('submit', function(event) {
//       // Prevent the default form submission
//       event.preventDefault();
      
//       alert('Welcome');
      
//       window.location.href = 'index.html';
//     });
//   }
// Set up constants
const apiUrl = 'http://localhost:4001/api/auth/login'; // Adjust to your login endpoint
const loader = document.getElementById('loader');
const loginForm = document.getElementById('login-form');

// Show and hide loader
function showLoader() {
  loader.style.display = 'block';
}

function hideLoader() {
  loader.style.display = 'none';
}

// Helper function to handle API requests
async function apiRequest(endpoint, method = 'POST', data = null) {
  const headers = {
    'Content-Type': 'application/json',
  };

  const response = await fetch(endpoint, {
    method: method,
    headers: headers,
    body: data ? JSON.stringify(data) : null,
  });

  return response.json();
}

// Login form submission event
loginForm.onsubmit = async function (e) {
  e.preventDefault(); // Prevent default form submission
  showLoader(); // Show loader

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const formData = { email, password };

  try {
    const response = await apiRequest(apiUrl, 'POST', formData);

    if (response.success) {
      // Save the token in localStorage
      localStorage.setItem('accessToken', response.accessToken);

      // Redirect to homepage on successful login
      window.location.href = './index.html';
    } else {
      alert('Login failed. Please check your email and password.');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred. Please try again.');
  } finally {
    hideLoader(); // Hide loader after response is received
  }
};