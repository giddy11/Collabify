const editBtn = document.getElementById("edit-btn");
const modal = document.getElementById("event-modal");
const viewModal = document.getElementById("view-modal");

const API_BASE_URL = "https://collabify-oloy.onrender.com/api/profile";
const API_USER_URL = "https://collabify-oloy.onrender.com/api/user";
// const API_BASE_URL = "https://collabify-oloy.onrender.com/api/profile";

async function fetchUserProfile() {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    window.location.href = "./signin.html";
    return;
  }

  const response = await fetch(`${API_BASE_URL}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      window.location.href = "./signin.html";
      return;
    }
    throw new Error(`Failed to fetch users: ${response.statusText}`);
  }

  const data = await response.json();
  console.log("API Response:", data); // Debugging
  return data.data; // Return the array of users
}

editBtn.addEventListener("click", async () => {
  modal.style.display = "flex";
  const user = JSON.parse(localStorage.getItem("user")); // Parse stored JSON
  const userId = user?._id; // Safely access the id

  if (!userId) {
    console.error("User ID not found in localStorage");
    return;
  }

  try {
    const response = await fetch(`${API_USER_URL}/${userId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching user: ${response.statusText}`);
    }

    const result = await response.json();
    const user = result.user; // Extract user data from the response

    // Populate modal form fields
    populateModalForm(user);
  } catch (error) {
    console.error("Error fetching user details:", error.message);
  }
});

function populateModalForm(user) {
  document.getElementById("fullName").value = user.fullName || "";
  // document.getElementById("dob").value = user.dob || "";
  document.getElementById("dob").value = user.dob
    ? new Date(user.dob).toISOString().split("T")[0] // Convert to YYYY-MM-DD
    : "";
  document.getElementById("phone").value = user.phone || "";
  document.getElementById("country").value = user.country || "";
  document.getElementById("field").value = user.field || "";
  document.getElementById("address").value = user.address || "";
  document.getElementById("city").value = user.city || "";
}

document
  .querySelector(".edit-profile-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const user = JSON.parse(localStorage.getItem("user")); // Parse stored JSON
    const userId = user?._id; // Safely access the id

    if (!userId) {
      console.error("User ID not found in localStorage");
      return;
    }
    const updatedData = {
      id: userId,
      fullName: document.getElementById("fullName").value,
      dob: document.getElementById("dob").value,
      phone: document.getElementById("phone").value,
      country: document.getElementById("country").value,
      field: document.getElementById("field").value,
      address: document.getElementById("address").value,
      city: document.getElementById("city").value,
    };

    try {
      const response = await fetch(`${API_USER_URL}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error(`Error updating user: ${response.statusText}`);
      }

      const result = await response.json();
      alert(result.message); // Notify user of success or failure
      window.location.href = "./profile.html";
      modal.style.display = "none"; // Close the modal
    } catch (error) {
      console.error("Error updating user:", error.message);
      alert("Failed to update user. Please try again.");
    }
  });

function renderUserProfile(user) {
  // Update profile card
  // document.querySelector('.profile-image img').src = user.profilePicture || '/img/profile-picture.jpg';
  document.querySelector(".profile-details h2").textContent =
    user.fullName || "No name provided";
  document.querySelector(".profile-details p").textContent =
    user.email || "No email provided";
  // document.querySelector('.bio').value = user.bio || 'Enter your bio here';

  // Personal Info Section
  const infoCard = document.querySelector(".info-card");
  const infoItems = infoCard.querySelectorAll(".info-item");

  // Update Personal Information
  infoItems[0].querySelector("p").innerHTML = `<strong>Full Name:</strong> ${
    user.fullName || "No name provided"
  }`;
  infoItems[1].querySelectorAll(
    "p"
  )[0].innerHTML = `<strong>Email Address:</strong> ${
    user.email || "No email provided"
  }`;
  infoItems[1].querySelectorAll(
    "p"
  )[1].innerHTML = `<strong>Phone Number:</strong> ${
    user.phone || "No phone number"
  }`;
  // infoItems[2].querySelectorAll('p')[0].innerHTML = `<strong>Date of Birth:</strong> ${user.dob || 'No date of birth added'}`;
  infoItems[2].querySelectorAll(
    "p"
  )[0].innerHTML = `<strong>Date of Birth:</strong> ${
    user.dob
      ? new Date(user.dob).toISOString().split("T")[0]
      : "No date of birth added"
  }`;
  infoItems[2].querySelectorAll(
    "p"
  )[1].innerHTML = `<strong>My Stack:</strong> ${
    user.field || "No stack added"
  }`;

  // Location Section
  const locationCard = document.querySelector(".info-card:nth-child(2)");
  const locationItems = locationCard.querySelectorAll(".info-item");
  locationItems[0].querySelectorAll(
    "p"
  )[0].innerHTML = `<strong>Country:</strong> ${
    user.country || "No country provided"
  }`;
  locationItems[0].querySelectorAll(
    "p"
  )[1].innerHTML = `<strong>State:</strong> ${
    user.city || "No state provided"
  }`;
  locationItems[1].querySelectorAll(
    "p"
  )[0].innerHTML = `<strong>City:</strong> ${user.city || "No city provided"}`;
  locationItems[1].querySelectorAll(
    "p"
  )[1].innerHTML = `<strong>House Address:</strong> ${
    user.address || "No address provided"
  }`;
}

// Fetch and render user profile on page load
async function loadUserProfile() {
  const userProfile = await fetchUserProfile();
  if (userProfile) {
    renderUserProfile(userProfile);
  }
}

// Close Modals on Background Click:
window.addEventListener("click", (event) => {
  if (event.target === modal) modal.style.display = "none";
  if (event.target === viewModal) viewModal.style.display = "none";
});

window.addEventListener("click", (event) => {
  if (event.target === modal) {
    modal.style.display = "none";
  }
});

document.querySelectorAll(".cancel-button").forEach((btn) => {
  btn.addEventListener("click", () => {
    btn.closest(".modal").style.display = "none";
  });
});

loadUserProfile();
