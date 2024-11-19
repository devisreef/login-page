const userForm = document.getElementById('userForm');
const userList = document.getElementById('userList');
const submitButton = document.getElementById('submitButton');

const apiUrl = 'http://localhost:5000/api/users'; // Replace with your backend API URL

// Fetch and display users
const fetchUsers = async () => {
    try {
        const response = await fetch(apiUrl);
        const users = await response.json();
        displayUsers(users);
    } catch (error) {
        console.error('Error fetching users:', error);
    }
};

// Display users in the table
const displayUsers = (users) => {
    userList.innerHTML = '';
    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.dob}</td>
            <td>
                <button onclick="editUser(${user.id})">Edit</button>
                <button onclick="deleteUser(${user.id})">Delete</button>
            </td>
        `;
        userList.appendChild(row);
    });
};

// Add or update user
userForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('userId').value;
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const dob = document.getElementById('dob').value;

    const userData = { name, email, dob };

    try {
        if (id) {
            // Update user
            await fetch(`${apiUrl}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
            });
            submitButton.textContent = 'Add User';
        } else {
            // Add new user
            await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
            });
        }

        userForm.reset();
        fetchUsers();
    } catch (error) {
        console.error('Error saving user:', error);
    }
});

// Edit user
const editUser = async (id) => {
    try {
        const response = await fetch(`${apiUrl}/${id}`);
        const user = await response.json();

        document.getElementById('userId').value = user.id;
        document.getElementById('name').value = user.name;
        document.getElementById('email').value = user.email;
        document.getElementById('dob').value = user.dob;
        submitButton.textContent = 'Update User';
    } catch (error) {
        console.error('Error fetching user:', error);
    }
};

// Delete user
const deleteUser = async (id) => {
    try {
        await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
        fetchUsers();
    } catch (error) {
        console.error('Error deleting user:', error);
    }
};

// Initialize app
fetchUsers();
