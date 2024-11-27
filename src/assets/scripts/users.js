const API_USER_URL = "https://collabify-oloy.onrender.com/api/user";

// Select buttons, modal, and form elements
const editBtn = document.getElementById("edit-btn");
const delBtn = document.getElementById("del-btn");
const deleteModal = document.getElementById("deleteModal");
const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
const cancelDeleteBtn = document.getElementById("cancelDeleteBtn");
const userFormCreate = document.getElementById("addUserForm");
let userFormEdit = document.getElementById("editUserForm");

// State to track selected user
let selectedUserId = null;

// Fetch users
async function fetchUsers() {
  try {
    let token = localStorage.getItem("accessToken");
    const response = await fetch(`${API_USER_URL}s`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const result = await response.json();
    return response.ok ? result.data || [] : [];
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
}

// Handle user selection
function handleUserSelection(userId) {
  selectedUserId = userId;
  editBtn.style.display = "inline-block";
  delBtn.style.display = "inline-block";
}

async function editUser() {
  openEditModal();
  if (!selectedUserId) {
    alert("No user selected.");
    return;
  }

  try {
    const token = localStorage.getItem("accessToken");
    console.log("token in edit", token);
    console.log("id in edit", selectedUserId);

    const response = await fetch(`${API_USER_URL}/${selectedUserId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const result = await response.json();
    if (response.ok) {
      const user = result.user;
      console.log("user  in edit user response.ok", user.role);

      userFormEdit.elements["role"].value = user.role || "";
      // document.querySelector("#addUserModal .modal-header h2").textContent = "Edit User";
    } else {
      alert(`Error fetching user: ${result.message}`);
    }
  } catch (error) {
    console.log("Error:", error);
  }
}

// Save user
async function saveUser() {
  openCreateModal();
  let token = localStorage.getItem("accessToken");

  const updatedData = {
    email: userFormCreate.elements["email"].value,
  };

  try {
    const response = await fetch(API_USER_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    });
    const result = await response.json();
    if (response.ok) {
      alert("User added successfully");
      closeCreateModal();
      fetchUsers();
    } else {
      console.error("Error updating user:", result.message);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

// Delete user
function deleteUser() {
  deleteModal.style.display = "block";
}

async function confirmDelete() {
  if (!selectedUserId) return;

  try {
    let token = localStorage.getItem("accessToken");

    const response = await fetch(API_USER_URL, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: selectedUserId }),
    });
    const result = await response.json();
    if (response.ok) {
      alert("User deleted successfully");
      resetForm();
      window.location.reload();
      deleteModal.style.display = "none";
      fetchUsers();
    } else {
      console.error("Error deleting user:", result.message);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

function cancelDelete() {
  deleteModal.style.display = "none";
}

// Populate the table with users
async function populateTable() {
  const users = await fetchUsers();
  const tbody = document.getElementById("userTableBody");
  tbody.innerHTML = "";

  users.forEach((user) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td><input type="checkbox" class="user-checkbox" data-id="${
        user._id
      }"></td>
      <td>${user.fullName || "N/A"}</td>
      <td>${user.email}</td>
      <td>${user.role === 0 ? "User" : "Admin"}</td>
      <td>${user.field || "N/A"}</td>
      <td>${user.lastAccess || "N/A"}</td>
    `;
    tbody.appendChild(row);
  });

  // Add event listeners to checkboxes
  document.querySelectorAll(".user-checkbox").forEach((checkbox) => {
    checkbox.addEventListener("change", function () {
      if (this.checked) {
        selectedUserId = this.dataset.id;
        console.log("selectedUserId in edit", selectedUserId);
        handleUserSelection(selectedUserId);
      } else {
        selectedUserId = null;
        editBtn.style.display = "none";
        delBtn.style.display = "none";
      }
    });
  });
}

// Open the modal
function openCreateModal() {
  document.getElementById("addUserModal").style.display = "block";
}

function openEditModal() {
  document.getElementById("editUserModal").style.display = "block";
}

function closeEditModal() {
  document.getElementById("editUserModal").style.display = "none";
  resetForm();
}

// Close the modal
function closeCreateModal() {
  document.getElementById("addUserModal").style.display = "none";
  resetForm();
}

// Reset form fields
function resetForm() {
  userFormCreate.reset();
  userFormCreate.dataset.userId = "";
  document
    .querySelectorAll(".user-checkbox")
    .forEach((checkbox) => (checkbox.checked = false));
  editBtn.style.display = "none";
  delBtn.style.display = "none";
}

// Event listeners
document.addEventListener("DOMContentLoaded", populateTable);

editBtn.addEventListener("click", editUser);
delBtn.addEventListener("click", deleteUser);
confirmDeleteBtn.addEventListener("click", confirmDelete);
cancelDeleteBtn.addEventListener("click", cancelDelete);

// Form submission to add
userFormCreate.addEventListener("submit", async function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value;
  
  const userData = {
    email,
  };

  try {
    const token = localStorage.getItem("accessToken");

    const response = await fetch(API_USER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    if (response.ok) {
      alert("User added successfully!");
      closeCreateModal();
      await populateTable(); // Refresh the user table
    } else {
      console.error("Error creating user:", data.message);
      alert(`Error: ${data.message}`);
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Failed to create user. Please try again.");
  }
});

//edit
userFormEdit.addEventListener("submit", function (event) {
  event.preventDefault();

  const userId = JSON.parse(localStorage.getItem("user"));
  let token = localStorage.getItem("accessToken");
  console.log("user in edit submit", userId._id);

  const role = parseInt(document.getElementById("role").value);

  console.log("role in edit submit", role);

  fetch("https://collabify-oloy.onrender.com/api/user-role", {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: selectedUserId,
      role: role,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        alert("User role updated successfully!");
        window.location.reload();
        resetForm();

        closeEditModal(); // Close the modal
      } else {
        alert(data.message);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("An error occurred while updating the user role.");
    });
});