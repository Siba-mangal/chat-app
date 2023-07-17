// import { io } from 'socket.io-client';

document.getElementById("logout-button").addEventListener("click", function () {
  location.href = "../login/index.html";
  localStorage.clear();
});

document.querySelector(".profile-box").addEventListener("click", function () {
  if (document.getElementById("logout-button").style.display === "block") {
    document.getElementById("logout-button").style.display = "none";
  } else {
    document.getElementById("logout-button").style.display = "block";
  }
});

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

function getUsername() {
  const token = localStorage.getItem("token");
  const decodeToken = parseJwt(token);
  console.log(decodeToken.userId);
  const userId = decodeToken.userId;
  return userId;
}

const token = localStorage.getItem("token");
let receiverId;

document.addEventListener("DOMContentLoaded", async function () {
  const usernameElement = document.querySelector(".chat-sidebar");
  document.getElementById("username").innerHTML = parseJwt(token).username;

  await axios
    .get("http://localhost:3000/api/allUser", {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => {
      console.log(response.data);

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
      // let isChatBoxDisplayed = false;

      const loggedUser = document.querySelectorAll(".logged-in-user");
      loggedUser.forEach((person) => {
        person.addEventListener("click", async function () {
          // document.getElementById("head-tag").hidden = true;
          let isChatBoxDisplayed = false;
          // console.log(this.id);
          // --------------------

          // Get the value of the id attribute
          const pElement = this.querySelector("p");
          const pId = pElement.getAttribute("id");
          console.log(pId);
          receiverId = pId;

          //---------------------
          const getMsgObj = {
            sender: getUsername(),
            receiver: receiverId,
          };
          document.querySelector(".chat-messages").innerHTML = "";
          const users = await axios.post(
            "http://localhost:3000/api/allChat",
            getMsgObj,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          console.log(users);
          const totalMsg = users.data.chats.length;
          console.log(users.data.chats[totalMsg - 1].id);
          localStorage.setItem(
            "lastMessage",
            users.data.chats[totalMsg - 1].id
          );

          users.data.chats.forEach((chat) => {
            // const div1 = document.createElement("div");
            const div2 = document.createElement("div");

            div2.setAttribute(
              "class",
              `message-${chat.fromSelf ? "sender" : "receiver"}`
            );
            const div3 = document.createElement("div");
            div3.setAttribute("class", "content");

            const pElem = document.createElement("p");
            pElem.innerHTML = chat.message;
            div3.appendChild(pElem);
            div2.appendChild(div3);
            document.querySelector(".chat-messages").appendChild(div2);
          });
          // --------------------
          document.getElementById("person-name").innerHTML = person.textContent;
          if (!isChatBoxDisplayed) {
            // Show the chat box
            document.getElementById("head-tag").style.display = "none";
            document.querySelector(".chat-box").style.display = "block";
            document.getElementById("user-name").style.display = "block";
            isChatBoxDisplayed = true;
          } else {
            // Only change the person name
            document.getElementById("person-name").innerHTML =
              person.textContent;
          }
        });
      });
    });
});

//send message to server

const inputField = document.querySelector(".chat-input input");
const sendButton = document.querySelector("#send-msg");

sendButton.addEventListener("click", async () => {
  const message = inputField.value;
  // console.log("Message:", message);

  const msgObj = {
    sender: getUsername(),
    receiver: receiverId,
    content: message,
  };
  console.log("Message:", msgObj);

  await axios
    .post("http://localhost:3000/api/addChat", msgObj, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });
  inputField.value = "";
});
