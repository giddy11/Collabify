const addBtn = document.querySelector(".add-btn");
const modal = document.getElementById("event-modal");
const closeBtn = document.querySelector(".close-btn");

const loader = document.getElementById("loader"); // Get the loader element

// Show the loader
function showLoader() {
  loader.style.display = "flex"; // Show loader
}

// Hide the loader
function hideLoader() {
  loader.style.display = "none"; // Hide loader
}

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

/**
 * 
 */
// Initialise API Connection
const API_BASE_URL = "https://collabify-oloy.onrender.com/api/onboarding";
// const API_BASE_URL = "https://collabify-oloy.onrender.com/api/onboarding";

async function fetchOnboardings() {
  const token = localStorage.getItem("accessToken");  // Get token from localStorage

  if (!token) {
    throw new Error("No token found. Please log in first.");
  }

  const response = await fetch(`${API_BASE_URL}s`, {
    method: "GET",  // Ensure it's a GET request
    headers: {
      "Authorization": `Bearer ${token}`,  // Pass token in Authorization header
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch onboardings: ${response.statusText}`);
  }

  const data = await response.json();
  console.log("Fetched Onboardings:", data); // Inspect response
  return data.onboardings;  // Return the onboardings array
}



async function createOnboarding(data) {
  const token = localStorage.getItem("accessToken"); // Retrieve the token from localStorage

  const response = await fetch(`${API_BASE_URL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`, // Add the token to the Authorization header
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to create onboarding: ${response.statusText}`);
  }

  const result = await response.json();
  return result.onboarding;
}

async function fetchOnboardingDetails(id) {
  if (!id) {
    throw new Error("ID is required");
  }

  const token = localStorage.getItem("accessToken"); // Retrieve the token from localStorage

  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "GET", // Ensure method is GET for fetching details
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`, // Add the token to the Authorization header
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch onboarding: ${response.statusText}`);
  }

  return response.json();
}

async function updateOnboarding(id, data) {
  const token = localStorage.getItem("accessToken"); // Retrieve the token from localStorage

  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`, // Add the token to the Authorization header
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to update onboarding: ${response.statusText}`);
  }

  return response.json();
}

async function deleteOnboarding(id) {
  const token = localStorage.getItem("accessToken"); // Retrieve the token from localStorage

  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`, // Add the token to the Authorization header
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to delete onboarding: ${response.statusText}`);
  }

  return response.json();
}


// Dynamic Item Rendering:
const itemContainer = document.getElementById("item-container");

function updateItemInDOM(item) {
  const itemButton = Array.from(itemContainer.children).find(
    (child) => child.getAttribute('item-form') === item._id // Use _id to find the correct item
  );

  if (itemButton) {
    // Update the button content with the new item data
    itemButton.innerHTML = `
      <div class="two-details">
        <h1>${item.name}</h1>
        <p class="topic">${item.topic}</p>
        <p class="date">${item.department}</p>
        <p><span>${item.noOfAcceptance}</span> Fellows Understands</p>
      </div>`;
  }
}

function renderItem(item) {
  const button = document.createElement("button");
  button.className = "box-link";

  button.innerHTML = `
    <div class="two-details">
      <h1>${item.name}</h1>
      <p class="topic">${item.topic}</p>
      <p class="date">${item.department}</p>
      <p><span>${item.noOfAcceptance}</span> Fellows Understands</p>
    </div>`;
  button.addEventListener("click", () => openViewModal(item._id));
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
  event.preventDefault(); // Prevent the default form submission
  
  // Show the loader
  showLoader();

  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  console.log(`data is - ${data._id}`);

  // Check if _id exists to distinguish between creating and updating
  try {
    if (data._id) {
      // Update existing onboarding
      await updateOnboarding(data._id, data);
    } else {
      // Create new onboarding
      await createOnboarding(data);
    }
    
    // Reload the page after submission
    window.location.reload();
  } catch (error) {
    console.error("Error during submission:", error);
  } finally {
    // Hide the loader after the operation is complete
    hideLoader();
    // form.reset(); // Reset form
    submitModal.style.display = "none"; // Close the modal
  }
});

function openDeleteModal(id) {
  deleteModal.style.display = "flex";

  confirmDeleteBtn.onclick = async () => {
    try {
      // Show loader while deleting
      showLoader();

      await deleteOnboarding(id);
      deleteModal.style.display = "none";
      
      // Remove the item from the DOM
      const itemButton = Array.from(itemContainer.children).find(
        (child) => child.textContent.includes(item.name)
      );
      if (itemButton) itemContainer.removeChild(itemButton);
    } catch (error) {
      alert("Failed to delete item. Please try again.");
    } finally {
      // Hide the loader after the operation is complete
      hideLoader();
    }
  };

  cancelDeleteBtn.onclick = () => {
    deleteModal.style.display = "none"; // Close the delete modal
  };
}


function openViewModal(_id) {
  fetchOnboardingDetails(_id).then((response) => {
    const item = response.onboarding;  // Extract the onboarding object

    console.log(item);  // Log the item object to check its structure

    viewDetails.innerHTML = `
      <h1>Week: ${item.name || 'N/A'}</h1>
      <p>Lesson: ${item.topic || 'N/A'}</p>
      <p>Link: <a href="${item.link}" target="_blank">${item.link}</a></p>
      <p>Class: ${item.department || 'N/A'}</p>
      <p>Fellows: ${item.noOfAcceptance || '0'}</p>`;

    viewModal.style.display = "flex";

    // Set up Edit button
    document.getElementById("edit-btn").onclick = () => openEditForm(item);

    // Set up Delete button
    document.getElementById("delete-btn").onclick = async () => {
      if (confirm("Are you sure you want to delete this item?")) {
        try {
          await deleteOnboarding(_id);
          viewModal.style.display = "none";
          // Remove the item from the DOM
          const itemButton = Array.from(itemContainer.children).find(
            (child) => child.textContent.includes(item.name)
          );
          if (itemButton) itemContainer.removeChild(itemButton);
        } catch (error) {
          alert("Failed to delete item. Please try again.");
        }
      }
    };
  }).catch((error) => {
    console.error("Error fetching onboarding details:", error);
  });
}


function openEditForm(item) {
  form.name.value = item.name || '';
  form.topic.value = item.topic || '';
  form.link.value = item.link || '';
  form.department.value = item.department || '';
  form.noOfAcceptance.value = item.noOfAcceptance || '';
  form._id.value = item._id || '';
  modal.style.display = "flex";
  viewModal.style.display = "none";
}

// Close Modals on Background Click:
window.addEventListener("click", (event) => {
  if (event.target === modal) modal.style.display = "none";
  if (event.target === viewModal) viewModal.style.display = "none";
});

// Initialize the Page:
document.querySelector(".add-btn").addEventListener("click", () => {
  modal.style.display = "flex";
});

document.querySelectorAll(".close-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    btn.closest(".modal").style.display = "none";
  });
});

loadItems()