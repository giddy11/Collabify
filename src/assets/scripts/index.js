//check for token
const token = localStorage.getItem('accessToken');
console.log(token);
if(!token) {
  window.location.href = './signin.html';
}

document.addEventListener("DOMContentLoaded", function () {
  const dashboardBtn = document.getElementById("dashboard-btn");
  const logo = document.querySelector(".logo");
  const logoShort = document.querySelector(".logo-short");
  const logoFull = document.querySelector(".logo-full");

  const side_bar = document.getElementById("side-bar");
  const side_bar_p = document.querySelectorAll(".details");

  let isToggled = false;

  dashboardBtn.addEventListener("click", function () {
    if (!isToggled) {
      // Minimize logo and toggle visibility
      logo.style.width = "50px";
      logo.style.paddingLeft = "5px";
      logo.style.paddingRight = "5px";
      logoShort.style.display = "inline";
      logoFull.style.display = "none";

      side_bar.style.width = "50px";
      side_bar_p.forEach((p) => (p.style.display = "none"));
    } else {
      // Revert to the original state
      logo.style.width = "350px";
      logo.style.paddingLeft = "";
      logo.style.paddingRight = "";
      logoShort.style.display = "none";
      logoFull.style.display = "inline";

      side_bar.style.width = "340px";
      side_bar_p.forEach((p) => (p.style.display = "inline"));
    }
    isToggled = !isToggled;
  });

  document.getElementById("profileIcon").addEventListener("click", function () {
    const dropdownMenu = document.getElementById("dropdownMenu");
    // Toggle the display style
    if (
      dropdownMenu.style.display === "none" ||
      dropdownMenu.style.display === ""
    ) {
      dropdownMenu.style.display = "block";
    } else {
      dropdownMenu.style.display = "none";
    }
  });

  const user = JSON.parse(localStorage.getItem("user")); // Get user data from localStorage

  if (user && user.role === 0) {
    // If the user's role is 0, hide the admin navigation
    const adminItems = document.querySelectorAll("#admin1, #admin2, #admin3, #admin4, #admin5, #admin6");
    adminItems.forEach(item => item.style.display = "none");
    // window.location.href = './directory.html';

  }
});
