//check for token
const token = localStorage.getItem('accessToken');
console.log(token);
if(!token) {
  window.location.href = './signin.html';
}

// Functionality for editing the bio
const bioTextarea = document.querySelector('.bio');
bioTextarea.addEventListener('input', () => {
  const maxLength = 120;
  const bioLength = bioTextarea.value.length;

  if (bioLength > maxLength) {
    bioTextarea.value = bioTextarea.value.slice(0, maxLength);
    alert("Bio cannot exceed 120 characters.");
  }
});

// Add skill button functionality
const addSkillBtn = document.querySelector('.add-skill-btn');
addSkillBtn.addEventListener('click', () => {
  alert('Add skill functionality coming soon!');
});
