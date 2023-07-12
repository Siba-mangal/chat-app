document.getElementById("logout-button").addEventListener("click", function () {
  location.href = "../login/index.html";
  localStorage.clear();
});
const token = localStorage.getItem("token");
let receiverName;

document.addEventListener("DOMContentLoaded", async function () {
  // const username = getUsername(); // Fetch the logged-in username from the server
  // Set the username in the HTML
  const usernameElement = document.querySelector(".chat-sidebar");

  await axios
    .get("http://localhost:3000/api/dashboard", {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => {
      console.log(response.data.users);
      for (let i = 0; i < response.data.users.length; i++) {
        const para = document.createElement("p");
        // para.setAttribute("class", "para");
        para.setAttribute("id", `${response.data.users[i].id}`);
        const node = document.createTextNode(response.data.users[i].username);
        para.appendChild(node);
        console.log(para);

        const element = document.createElement("div");
        element.setAttribute("class", "logged-in-user");
        element.appendChild(para);

        usernameElement.appendChild(element);

        // to show chat user box
      }

      const loggedUser = document.querySelectorAll(".logged-in-user");
      loggedUser.forEach((person) => {
        person.addEventListener("click", function () {
          // document.getElementById("head-tag").hidden = true;
          console.log(person.textContent);
          receiverName = person.textContent;
          if (
            document.getElementById("head-tag").style.display === "none" &&
            document.querySelector(".chat-box").style.display === "block"
          ) {
            document.getElementById("head-tag").style.display = "block";
            document.querySelector(".chat-box").style.display = "none";
          } else {
            document.getElementById("head-tag").style.display = "none";
            document.querySelector(".chat-box").style.display = "block";
          }
        });
      });
    });
});

// --------------------

// document.addEventListener("DOMContentLoaded", async function () {});

// -----------------------

function getUsername() {
  const token = localStorage.getItem("token");
  const decodeToken = parseJwt(token);
  // console.log(decodeToken.userId);
  const username = decodeToken.username;
  return username;
}

function parseJwt(token) {
  var baseUrl = token.split(".")[1];
  var base = baseUrl.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window
      .atob(base)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );
  return JSON.parse(jsonPayload);
}

//send message to server

const inputField = document.querySelector(".chat-input input");
const sendButton = document.querySelector("#send-msg");

sendButton.addEventListener("click", async () => {
  const message = inputField.value;
  // console.log("Message:", message);

  const msgObj = {
    sender: getUsername(),
    receiver: receiverName,
    content: message,
  };
  console.log("Message:", msgObj);

  await axios
    .post("http://localhost:3000/api/chat", msgObj, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => {
      console.log(response);
    });

  inputField.value = "";
});
