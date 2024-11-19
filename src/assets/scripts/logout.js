async function logout() {
  // Clear the access token from localStorage
  localStorage.removeItem('accessToken');

  /**
 * 
 */
  try {
    // Make the logout request to the backend
    // const apiUrl = 'http://localhost:4001/api/auth/signup';
    const response = await fetch('https://collabify-oloy.onrender.com/api/auth/logout', {
      method: 'POST',
      credentials: 'include', // Ensure cookies are sent with the request
    });

    // const response = await fetch('http://localhost:4001/api/auth/logout', {
    //   method: 'POST',
    //   credentials: 'include', // Ensure cookies are sent with the request
    // });

    const data = await response.json();
    if (data.success) {
      // Redirect to login page after successful logout
      console.log("Logout successful");
      window.location.href = './signin.html';
    } else {
      alert('Logout failed, please try again.');
    }
  } catch (error) {
    console.error('Logout error:', error);
    alert('An error occurred while logging out.');
  }
}