const API_USER_URL = "http://localhost:4001/api/user";


async function fetchUsers() {
    try {
        const token = localStorage.getItem('accessToken');
        console.log("Access Token:", token);

        const response = await fetch(`${API_USER_URL}s`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        const result = await response.json();

        if (response.ok) {
            // Accessing the correct field from the backend response
            return result.data || [];
        } else {
            console.error('Error fetching users:', result.message);
            return [];
        }
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
}



  async function populateTable() {
    const users = await fetchUsers();
    const tbody = document.getElementById("userTableBody");
    tbody.innerHTML = "";
  
    users.forEach((user, index) => {
      const row = document.createElement("tr");
  
      row.innerHTML = `
        <td><input type="checkbox" data-index="${index}"></td>
        <td>${user.fullName || user.name}</td>
        <td>${user.email}</td>
        <td>${user.role === 1 ? "Admin" : "User"}</td>
        <td>${user.field || "N/A"}</td>
        <td>${user.lastAccess || "N/A"}</td>
      `;
  
      tbody.appendChild(row);
    });
  }
  
  document.addEventListener("DOMContentLoaded", populateTable);

  document.getElementById("addUserForm").addEventListener("submit", async function (e) {
    e.preventDefault();
  
    const role = document.getElementById("role").value;
    const email = document.getElementById("email").value;
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const mobilePhone = document.getElementById("mobilePhone").value;
  
    const userData = {
      email,
      fullName: `${firstName} ${lastName}`,
      field: mobilePhone || null,
      role: parseInt(role), // Convert to integer for backend
    };
  
    try {
const token = localStorage.getItem('accessToken');

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
        closeModal();
        populateTable(); // Refresh the table
      } else {
        console.error('Error creating user:', data.message);
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert("Failed to create user. Please try again.");
    }
  });
  
//   // Function to open the modal
function openModal() {
    document.getElementById("addUserModal").style.display = "block";
  }
  
  // Function to close the modal
  function closeModal() {
    document.getElementById("addUserModal").style.display = "none";
  }
  
  // Event listener for form submission
  document.getElementById("addUserForm").addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent form from submitting
  
    const role = document.getElementById("role").value;
    const email = document.getElementById("email").value;
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const mobilePhone = document.getElementById("mobilePhone").value;
  
    // Example object to send to backend
    const userData = {
      role: parseInt(role), // Convert to integer for backend
      email,
      firstName,
      lastName,
      mobilePhone,
    };
  
    console.log("User Data Submitted:", userData);
  
    // Close modal after saving
    closeModal();
  });
  
  // Automatically populate the username field when email is entered
  document.getElementById("email").addEventListener("input", function () {
    const email = this.value;
    document.getElementById("username").value = email;
  });