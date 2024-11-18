// window.onload = function() {
//     const registerForm = document.getElementById('register-form');
    
//     registerForm.addEventListener('submit', function(event) {
//       // Prevent the default form submission
//       event.preventDefault();
      
//       alert('Please log in');
      
//       window.location.href = 'login.html';
//     });
//   }

// const apiUrl = 'https://collabify-oloy.onrender.com/api/auth/signup';
const apiUrl = 'http://localhost:4001/api/auth/signup';
const loader = document.getElementById('loader');
const registerForm = document.getElementById('register-form');

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

  const responseData = await response.json();
  return responseData;
}

// Signup form submission event
registerForm.onsubmit = async function (e) {
  e.preventDefault(); // Prevent default form submission
  showLoader(); // Show loader

  const fullName = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  
  const formData = { fullName, email, password };

  try {
    const response = await apiRequest(apiUrl, 'POST', formData);

    if (response.success) {
      localStorage.setItem('accessToken', response.accessToken);
      
      // Redirect to the index page on successful signup
      window.location.href = 'index.html';
    } else {
      alert('Signup failed. Please try again.');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred. Please try again.');
  } finally {
    hideLoader(); // Hide loader after response is received
  }
};