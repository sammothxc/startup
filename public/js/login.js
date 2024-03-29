document.addEventListener("DOMContentLoaded", function() {
    menu();
    setInterval(updateSeedCounter, 2000); // Update every 5 seconds
});


function menu() {
    let username = localStorage.getItem("username");
    const loginStatusElement = document.getElementById("loginStatus");
    const accountLinkElement = document.getElementById("accountLink");
    if (username) {
        // User is logged in, display username and logout button
        const logoutLink = document.createElement("a");
        logoutLink.textContent = "Logout";
        logoutLink.href = "index.html";
        logoutLink.onclick = logout();
        logoutLink.classList.add("li");
        loginStatusElement.appendChild(logoutLink);
        const userAccount = document.createElement("a");
        userAccount.textContent = username;
        userAccount.href = "account.html";
        userAccount.classList.add("li");
        accountLinkElement.appendChild(userAccount);
    } else {
        // User is not logged in, display login link
        const loginLink = document.createElement("a");
        loginLink.href = "login.html";
        loginLink.textContent = "Login";
        loginStatusElement.appendChild(loginLink);
    }
}

function register() {
    // Redirect to register.html
    window.location.href = "register.html";
}

function errorMsgEmpty() {
    const errorMessage = document.createElement("p");
    errorMessage.textContent = "Please enter a username and password.";
    errorMessage.classList.add("banner-message");
    errorMessage.classList.add("error-message");
    errorMessage.classList.add("slide-in");
    errorMessage.classList.add("poppins-semibold");
    document.body.insertBefore(errorMessage, document.body.firstChild);
    setTimeout(() => {
        errorMessage.remove();
    }, 4000);
}

function errorMsgIncorrect() {
    const errorMessage = document.createElement("p");
    errorMessage.textContent = "Username or password is incorrect.";
    errorMessage.classList.add("banner-message");
    errorMessage.classList.add("error-message");
    errorMessage.classList.add("slide-in");
    errorMessage.classList.add("poppins-semibold");
    document.body.insertBefore(errorMessage, document.body.firstChild);
    setTimeout(() => {
        errorMessage.remove();
    }, 4000);
}

function updateSeedCounter() {
    const seedCounterElement = document.getElementById("seedCounter");
    // Generate a random amount to increment the counter
    const incrementAmount = Math.floor(Math.random() * 10) + 1; // Random number between 1 and 10
    // Get the current value of the counter and parse it as an integer
    let currentCount = parseInt(localStorage.getItem("seedCounter"));
    if (!currentCount) {
        // If the counter is not set, set it to 0
        currentCount = 0;
        localStorage.setItem("seedCounter", currentCount);
    }
    // Increment the counter by the random amount
    currentCount += incrementAmount;
    // Update the counter display
    localStorage.setItem("seedCounter", currentCount);
    seedCounterElement.textContent = currentCount + " Seeds Donated Since 2024!";
}

// Login Control
async function loginUser() {
    login(`/api/auth/login`);
}

async function login(endpoint) {
    const username = document.querySelector('#username')?.value;
    const password = document.querySelector('#password')?.value;
    if (username.trim() === "" || password.trim() === "") {
        errorMsgEmpty();
        return;
    }
    const response = await fetch(endpoint, {
        method: 'post',
        body: JSON.stringify({ username: username, password: password }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    });
    if (response.ok) {
        localStorage.setItem("username", username);
        localStorage.setItem("registrationMessageDisplayed", "true");
        window.location.href = 'index.html';
    } else {
        const body = await response.json();
        errorMsgIncorrect();
    }
}

async function getUser(username) {
    // See if we have a user with the given email.
    const response = await fetch(`/api/user/${username}`);
    if (response.status === 200) {
        return response.json();
    }
    return null;
}

function logout() {
    localStorage.removeItem("username");
    localStorage.removeItem("welcomeMessageDisplayed");
    fetch(`/api/auth/logout`, {
        method: 'delete',
    }).then(() => (window.location.href = '/'));
}