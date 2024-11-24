const searchBtn = document.getElementById("search-btn");
const filterForm = document.getElementById("filters-form");
const resultsGrid = document.querySelector(".results-grid");

//check for token
// const token = localStorage.getItem('accessToken');
// console.log(token);
// if(!token) {
//   window.location.href = './signin.html';
// }

// Simulated user data
const users = [
  { name: "Kelechi Onyekwere", skills: "JavaScript, React", location: "Lagos", bio: "Frontend Developer" },
  { name: "John Stanley", skills: "Python, AI", location: "Remote", bio: "AI Enthusiast" },
  { name: "Amara Francis", skills: "Node.js, AWS", location: "Rivers", bio: "Fullstack Developer" },
];

// Render matched users
function renderUsers(filteredUsers) {
  resultsGrid.innerHTML = "";
  if (filteredUsers.length === 0) {
    resultsGrid.innerHTML = "<p>No matches found.</p>";
    return;
  }
  filteredUsers.forEach(user => {
    const userCard = `
      <div class="user-card">
        <h4>${user.name}</h4>
        <p><strong>Skills:</strong> ${user.skills}</p>
        <p><strong>Location:</strong> ${user.location}</p>
        <p>${user.bio}</p>
        <button>Send Request</button>
      </div>
    `;
    resultsGrid.innerHTML += userCard;
  });
}

// Handle search and filter
function handleSearch() {
  const searchValue = document.getElementById("search-bar").value.toLowerCase();
  const filteredUsers = users.filter(user =>
    user.skills.toLowerCase().includes(searchValue) ||
    user.location.toLowerCase().includes(searchValue) ||
    user.bio.toLowerCase().includes(searchValue)
  );
  renderUsers(filteredUsers);
}

function handleFilters(event) {
  event.preventDefault();
  const skillValue = document.getElementById("skills").value.toLowerCase();
  const locationValue = document.getElementById("location").value.toLowerCase();
  const filteredUsers = users.filter(user =>
    (skillValue === "" || user.skills.toLowerCase().includes(skillValue)) &&
    (locationValue === "" || user.location.toLowerCase().includes(locationValue))
  );
  renderUsers(filteredUsers);
}

searchBtn.addEventListener("click", handleSearch);
filterForm.addEventListener("submit", handleFilters);

// Initial render
renderUsers(users);
