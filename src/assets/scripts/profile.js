//check for token
// const token = localStorage.getItem('accessToken');
// console.log(token);
// if(!token) {
//   window.location.href = './signin.html';
// }

// Functionality for editing the bio
// const bioTextarea = document.querySelector('.bio');
// bioTextarea.addEventListener('input', () => {
//   const maxLength = 120;
//   const bioLength = bioTextarea.value.length;

//   if (bioLength > maxLength) {
//     bioTextarea.value = bioTextarea.value.slice(0, maxLength);
//     alert("Bio cannot exceed 120 characters.");
//   }
// });

// Add skill button functionality
const addSkillBtn = document.querySelector('.add-skill-btn');
addSkillBtn.addEventListener('click', () => {
  alert('Add skill functionality coming soon!');
});

// const API_BASE_URL = "http://localhost:4001/api/profile";
const API_BASE_URL = "https://collabify-oloy.onrender.com/api/profile";

async function fetchUsers() {
    const token = localStorage.getItem("accessToken"); 
  
    if (!token) {
      window.location.href = './signin.html';
      return;
    }
  
    const response = await fetch(`${API_BASE_URL}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  
    if (!response.ok) {
      if (response.status === 401) {
        window.location.href = './signin.html';
        return;
      }
      throw new Error(`Failed to fetch users: ${response.statusText}`);
    }
  
    const data = await response.json();
    console.log("API Response:", data); // Debugging
    return data.data; // Return the array of users
  }
  

  function renderUserProfile(user) {
    // Update profile card
    // document.querySelector('.profile-image img').src = user.profilePicture || '/img/profile-picture.jpg';
    document.querySelector('.profile-details h2').textContent = user.fullName || 'No name provided';
    document.querySelector('.profile-details p').textContent = user.email || 'No email provided';
    // document.querySelector('.bio').value = user.bio || 'Enter your bio here';
  
    // Update skills section
    // const skillsList = document.querySelector('.skills-list');
    // skillsList.innerHTML = ''; // Clear existing skills
    // (user.skills || []).forEach(skill => {
    //   const skillItem = `
    //     <li>
    //       <p>${skill.name}</p>
    //       <div class="progress-bar">
    //         <div class="progress" style="width: ${skill.level || 0}%;"></div>
    //       </div>
    //     </li>
    //   `;
    //   skillsList.insertAdjacentHTML('beforeend', skillItem);
    // });

    // Personal Info Section
  const infoCard = document.querySelector('.info-card');
  const infoItems = infoCard.querySelectorAll('.info-item');

  // Update Personal Information
  infoItems[0].querySelector('p').innerHTML = `<strong>Full Name:</strong> ${user.fullName || 'No name provided'}`;
  infoItems[1].querySelectorAll('p')[0].innerHTML = `<strong>Email Address:</strong> ${user.email || 'No email provided'}`;
  infoItems[1].querySelectorAll('p')[1].innerHTML = `<strong>Phone Number:</strong> ${user.phone || 'No phone number'}`;
  infoItems[2].querySelectorAll('p')[0].innerHTML = `<strong>Date of Birth:</strong> ${user.dob || 'No date of birth added'}`;
  infoItems[2].querySelectorAll('p')[1].innerHTML = `<strong>My Stack:</strong> ${user.field || 'No stack added'}`;

  // Location Section
  const locationCard = document.querySelector('.info-card:nth-child(2)');
  const locationItems = locationCard.querySelectorAll('.info-item');
  locationItems[0].querySelectorAll('p')[0].innerHTML = `<strong>Country:</strong> ${user.country || 'No country provided'}`;
  locationItems[0].querySelectorAll('p')[1].innerHTML = `<strong>State:</strong> ${user.city || 'No state provided'}`;
  locationItems[1].querySelectorAll('p')[0].innerHTML = `<strong>City:</strong> ${user.city || 'No city provided'}`;
  locationItems[1].querySelectorAll('p')[1].innerHTML = `<strong>House Address:</strong> ${user.address || 'No address provided'}`;
  }
  
  // Fetch and render user profile on page load
  async function loadUserProfile() {
    const userProfile = await fetchUsers();
    if (userProfile) {
      renderUserProfile(userProfile);
    }
  }
  
  loadUserProfile();  