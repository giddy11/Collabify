const API_BASE_URL = "http://localhost:4001/api/user";

async function fetchUsers() {
    const token = localStorage.getItem("accessToken"); 
  
    if (!token) {
      window.location.href = './signin.html';
      return;
    }
  
    const response = await fetch(`${API_BASE_URL}s`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  
    if (!response.ok) {
      if (response.status === 401) {
        window.location.href = './signin.html';
        return;
      }
      throw new Error(`Failed to fetch users: ${response.statusText}`);
    }
  
    const data = await response.json();
    console.log("API Response:", data); // Debugging
    return data.data; // Return the array of users
  }
  

const itemContainer = document.querySelector(".users-container");

function renderItem(item) {
    const button = document.createElement("button");
    button.className = "user-card";
  
    button.innerHTML = `
        <div class="profile-icon">
            <i class="fas fa-user-circle"></i>
        </div>
        <div class="user-info">
            <p class="user-name">${item.fullName || 'N/A'}</p>
            <p class="user-email"><i class="fas fa-envelope"></i> ${item.email || 'N/A'}</p>
            <p class="user-phone"><i class="fas fa-phone-alt"></i> ${item.phone || 'N/A'}</p>
            <p class="user-stack"><i class="fas fa-search"></i>${item.field || 'N/A'}</p>
        </div>
                          
                          `;
    button.addEventListener("click", () => openViewModal(item._id));
    itemContainer.appendChild(button);
  }
  
  
  async function loadItems() {
    const items = await fetchUsers();
  
    if (!Array.isArray(items)) {
      console.error("Expected an array but got:", items);
      return;
    }
  
    items.forEach(renderItem);
  }

  loadItems()