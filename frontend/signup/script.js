// Get form element and submit button
const signupForm = document.getElementById("signup-form");
const signupButton = document.getElementById("signup-button");

// Add event listener to form submit
signupForm.addEventListener("submit", function (e) {
  e.preventDefault(); // Prevent form submission

  // Get form values
  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirm-password").value;
  const file = document.getElementById("file").value;

  // Check if password matches confirm password
  if (password !== confirmPassword) {
    showPopupMessage("Passwords do not match. Please try again.");
    return;
  }

  // Create an object with the user data
  const user = {
    username: username,
    email: email,
    password: password,
    // image: file,
  };

  // Add user data to localStorage
  console.log(user);
  axios
    .post("http://localhost:3000/user/signup", user)
    .then((response) => {
      // console.log(response);
      if (response.status === 201) {
        // console.log(response);
        showPopupMessage(response.data.message);
      }
    })
    .catch((error) => {
      console.log(error);
      alert(error.response.data.message);
    });
  // localStorage.setItem("user", JSON.stringify(user));

  // Clear form inputs
  signupForm.reset();

  // Show success message
});

// Show popup message
function showPopupMessage(message) {
  const overlay = document.querySelector(".popup-overlay");
  const popup = document.querySelector(".popup-message");
  const popupText = document.getElementById("popup-text");

  // Set the message text
  popupText.textContent = message;

  // Show the overlay and popup
  overlay.style.display = "block";
  popup.style.display = "block";

  // Hide the popup after 3 seconds
  setTimeout(function () {
    hidePopupMessage();
  }, 3000);
}

// Hide popup message
const overlay = document.querySelector(".popup-overlay");
const popup = document.querySelector(".popup-message");
const closeButton = document.querySelector(".close-button");
const popupText = document.getElementById("popup-text");

function hidePopupMessage() {
  overlay.style.display = "none";
  popup.style.display = "none";
  window.location.href = "../login/index.html";
}

closeButton.addEventListener("click", hidePopupMessage);
