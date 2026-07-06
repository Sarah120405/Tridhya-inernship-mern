// DOM
const userList = document.getElementById("userList");
const userDetailsEl = document.getElementById("userDetails");

const postsByNameEl = document.getElementById("postsByName");
const postsCountEl = document.getElementById("postsCount");
const postsListEl = document.getElementById("postsList");
const totalPostsFooterEl = document.getElementById("totalPostsFooter");

const usersCountEl = document.getElementById("usersCount");
const totalUsersFooterEl = document.getElementById("totalUsersFooter");


const API_BASE = "https://jsonplaceholder.typicode.com";

let allUsers = [];
let selectedUserId = null;

const avatarColors = ["#7c6df2", "#3ecf8e", "#e0a52f", "#ec6f8e", "#3ba3d0", "#d0703b"];

function colorForId(id) {
    return avatarColors[id % avatarColors.length];
}

// 1. Fetch and render all users
function loadUsers() {
    
    userList.innerHTML = `<div>Loading Users....</div>`
    return fetch(`${API_BASE}/users`)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            allUsers = data;
            renderUserList(allUsers);
            usersCountEl.textContent = allUsers.length;
            totalUsersFooterEl.textContent = allUsers.length;
            
        })
        .catch((err) => {
            userList.innerHTML = `<div>${err}<div>`
            console.log("Error:", err);
        });
}

function renderUserList(users) {
    if (users.length === 0) {
        userList.innerHTML = `<li style="color: var(--muted); padding: 12px;">No users match your search.</li>`;
        return;
    }
    userList.innerHTML = users
        .map(
            (user) => `
        <li class="user-item ${user.id === selectedUserId ? "active" : ""}" data-user-id="${user.id}">
            <div class="avatar" style="background:${colorForId(user.id)}">${user.id}</div>
            <div class="info">
                <p class="name">${user.name}</p>
                <p class="email">${user.email}</p>
            </div>
            <div class="chevron">›</div>
        </li>
    `
        )
        .join("");
}

// Make user items clickable and fetch selected users Id for further rendering
userList.addEventListener("click", (event) => {
    const item = event.target.closest(".user-item");
    if (!item) return;

    const userId = Number(item.dataset.userId);
    selectUser(userId);
});

// 2. Render details and posts of selected user
function selectUser(userId) {
    selectedUserId = userId;
    
    const user = allUsers.find((u) => u.id === userId);
    if (!user) return;

    renderUserDetails(user);
    loadPostsForUser(user);
}



function renderUserDetails(user) {
    userDetailsEl.innerHTML = `
        <div class="detail-card">
            <div class="avatar" style="background:${colorForId(user.id)}">${user.id}</div>
            <div>
                <h3>${user.name}</h3>
                <p class="username">@${user.username}</p>
                <p class="contact-line">✉ ${user.email}</p>
                <p class="contact-line">☎ ${user.phone}</p>
                <p class="contact-line">🔗 ${user.website}</p>
            </div>
            <div class="detail-meta">
                <div>
                    <strong>Address</strong>
                    ${user.address.street}, ${user.address.suite}<br>
                    ${user.address.city}, ${user.address.zipcode}
                </div>
                <div>
                    <strong>Company</strong>
                    ${user.company.name}
                </div>
            </div>
        </div>
    `;
}

// Fetch and render posts for the selected user
function loadPostsForUser(user) {
    postsByNameEl.textContent = user.name;
    postsListEl.innerHTML = `<p style="color: var(--muted); padding: 12px;">Loading posts...</p>`;

    return fetch(`${API_BASE}/posts?userId=${user.id}`)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            }
            return response.json();
        })
        .then((posts) => {
            renderPostsList(posts);
            postsCountEl.textContent = posts.length;
            totalPostsFooterEl.textContent = posts.length;
            
        })
        .catch((err) => {
            postsListEl.innerHTML = `<p style="color: var(--muted); padding: 12px;">Could not load posts. \n${err}</p>`;
            console.log("Error:", err);
        });
}

function renderPostsList(posts) {
    if (posts.length === 0) {
        postsListEl.innerHTML = `<p style="color: var(--muted); padding: 12px;">This user has no posts.</p>`;
        return;
    }

    postsListEl.innerHTML = posts
        .map(
            (post, index) => `
        <div class="post-item data-post-id="${post.id}">
            <div class="post-index">${index + 1}</div>
            <div class="post-text">
                <p class="title">${post.title}</p>
                <p class="snippet">${post.body}</p>
            </div>
        </div>
    `
        )
        .join("");
}

loadUsers();