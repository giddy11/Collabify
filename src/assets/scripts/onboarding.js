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

// Initialise API Connection
const API_BASE_URL = "http://localhost:4001/api/onboarding";

async function fetchOnboardings() {
  const response = await fetch(`${API_BASE_URL}s`); // Matches "/api/onboardings"
  if (!response.ok) {
    throw new Error(`Failed to fetch onboardings: ${response.statusText}`);
  }
  return response.json();
}

async function createOnboarding(data) {
  const response = await fetch(`${API_BASE_URL}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(`Failed to create onboarding: ${response.statusText}`);
  }
  return response.json();
}

async function fetchOnboardingDetails(id) {
  const response = await fetch(`${API_BASE_URL}/${id}`); // Matches "/api/onboarding/:id"
  if (!response.ok) {
    throw new Error(`Failed to fetch onboarding: ${response.statusText}`);
  }
  return response.json();
}

async function updateOnboarding(id, data) {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(`Failed to update onboarding: ${response.statusText}`);
  }
  return response.json();
}

async function deleteOnboarding(id) {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error(`Failed to delete onboarding: ${response.statusText}`);
  }
  return response.json();
}

// Dynamic Item Rendering:
const itemContainer = document.getElementById("item-container");

function renderItem(item) {
  const button = document.createElement("button");
  button.className = "box-link";
  button.innerHTML = `
    <div class="two-details">
      <h1>${item.week}</h1>
      <p class="topic">${item.lessonTitle}</p>
      <p class="date">${item.class}</p>
      <p><span>${item.numberOfFellows}</span> Fellows Understands</p>
    </div>`;
  button.addEventListener("click", () => openViewModal(item.id));
  itemContainer.appendChild(button);
}

async function loadItems() {
  const items = await fetchOnboardings();
  items.forEach(renderItem);
}

// Form Submission and Update Logic:
// const modal = document.getElementById("event-modal");
const form = document.getElementById("item-form");
const viewModal = document.getElementById("view-modal");
const viewDetails = document.getElementById("view-details");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());
  if (data.id) {
    await updateItem(data.id, data);
  } else {
    const newItem = await createItem(data);
    renderItem(newItem);
  }
  modal.style.display = "none";
  form.reset();
});

function openViewModal(id) {
  fetchItemDetails(id).then((item) => {
    viewDetails.innerHTML = `
      <h1>Week: ${item.week}</h1>
      <p>Lesson: ${item.lessonTitle}</p>
      <p>Link: ${item.link}</p>
      <p>Class: ${item.class}</p>
      <p>Fellows: ${item.numberOfFellows}</p>`;
    viewModal.style.display = "flex";
    document.getElementById("edit-btn").onclick = () => openEditForm(item);
  });
}

function openEditForm(item) {
  form.week.value = item.week;
  form.lessonTitle.value = item.lessonTitle;
  form.link.value = item.link;
  form.class.value = item.class;
  form.numberOfFellows.value = item.numberOfFellows;
  form.id.value = item.id;
  modal.style.display = "flex";
  viewModal.style.display = "none";
}