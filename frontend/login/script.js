const logSuccess = document.getElementById("log-success");
document
  .getElementById("loginForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form submission

    // Get email and password values
    var phonenumber = document.getElementById("phonenumber").value;
    var password = document.getElementById("passwordInput").value;

    // Do something with the email and password (e.g., send to server for authentication)
    let loginData = {
      phonenumber: phonenumber,
      password: password,
    };
    console.log(loginData);
    // const dataFromLocalStorage = JSON.parse(localStorage.getItem("user"));
    axios
      .post("https://chat-app-3syl.onrender.com/user/login", loginData, {
        credentials: "included",
      })
      .then((response) => {
        if (response.status === 201) {
          console.log(response);
          localStorage.setItem("token", response.data.token);
          logSuccess.style.color = "green";
          logSuccess.innerHTML += response.data.message;
          location.href = "../chatdashboard/index.html";
        }
      })
      .catch((error) => {
        if (error.response.status === 401) {
          logSuccess.style.color = "red";
          logSuccess.innerHTML += error.response.data.message;
        }
      });

    // Reset form fields
    document.getElementById("phonenumber").value = "";
    document.getElementById("passwordInput").value = "";
  });
