function toggleMenu() {
  const menu = document.querySelector (".menu-links");
  const icon = document.querySelector (".hamburger-icon");
  menu.classList.toggle ("open")
  icon.classList.toggle ("open")
}

// Show Back to Top Button when Scrolling
const backToTopButton = document.querySelector('.back-to-top');

window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
      backToTopButton.style.display = 'block';
  } else {
      backToTopButton.style.display = 'none';
  }
});

// Smooth Scroll to Top
backToTopButton.addEventListener('click', (e) => {
  e.preventDefault();
  window.scrollTo({
      top: 0,
      behavior: 'smooth'
  });
});
