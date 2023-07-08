document.addEventListener("DOMContentLoaded", function () {
  const username = getUsername(); // Fetch the logged-in username from the server

  // Set the username in the HTML
  const usernameElement = document.getElementById("username");
  usernameElement.textContent = username;
});

function getUsername() {
  // This function should make a server request to fetch the logged-in username
  // Replace this with your server-side logic or API call
  // Example: return a static username for demonstration purposes
  return "JohnDoe";
}
