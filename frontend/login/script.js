const logSuccess = document.getElementById("log-success");
document
  .getElementById("loginForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form submission

    // Get email and password values
    var email = document.getElementById("emailInput").value;
    var password = document.getElementById("passwordInput").value;

    // Do something with the email and password (e.g., send to server for authentication)
    let loginData = {
      email: email,
      password: password,
    };
    // const dataFromLocalStorage = JSON.parse(localStorage.getItem("user"));
    axios
      .post("http://localhost:3000/user/login", loginData)
      .then((response) => {
        if (response.status === 201) {
          console.log(response);
          localStorage.setItem("token", response.data.token);
          logSuccess.style.color = "green";
          logSuccess.innerHTML += response.data.message;
        }
      })
      .catch((error) => {
        if (error.response.status === 401) {
          logSuccess.style.color = "red";
          logSuccess.innerHTML += error.response.data.message;
        }
      });
    // Reset form fields
    document.getElementById("emailInput").value = "";
    document.getElementById("passwordInput").value = "";
  });
