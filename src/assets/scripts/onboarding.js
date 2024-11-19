const addBtn = document.querySelector(".add-btn");
const modal = document.getElementById("event-modal");
const closeBtn = document.querySelector(".close-btn");

addBtn.addEventListener("click", () => {
  modal.style.display = "flex";
});

closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

window.addEventListener("click", (event) => {
  if (event.target === modal) {
    modal.style.display = "none";
  }
});
