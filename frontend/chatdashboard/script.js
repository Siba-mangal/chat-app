document.getElementById("logout-button").addEventListener("click", function () {
  location.href = "../login/index.html";
  localStorage.clear();
});

document.querySelector(".profile-box").addEventListener("click", function () {
  if (
    document.getElementById("logout-button").style.display === "block" &&
    document.getElementById("group-button").style.display === "block"
  ) {
    document.getElementById("logout-button").style.display = "none";
    document.getElementById("group-button").style.display = "none";
  } else {
    document.getElementById("logout-button").style.display = "block";
    document.getElementById("group-button").style.display = "block";
  }
});
const usernameElement = document.querySelector(".chat-sidebar");
const chatMessages = document.querySelector(".chat-messages");
const observer = new MutationObserver(function () {
  chatMessages.scrollTop =
    chatMessages.scrollHeight - chatMessages.clientHeight;
});
observer.observe(chatMessages, { childList: true });

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
  // console.log(decodeToken.userId);
  const userId = decodeToken.userId;
  return userId;
}

const token = localStorage.getItem("token");
let receiverId;

document.addEventListener("DOMContentLoaded", async function () {
  document.querySelector(".chat-sidebar").style.display = "block";
  document.getElementById("username").innerHTML = parseJwt(token).username;
  const allUsers = await axios.get("http://localhost:3000/api/allUser", {
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log(allUsers);
  showUsers(allUsers.data.users);
  const groups = await axios.get("http://localhost:3000/grp/group", {
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log(groups);
  // groups.data.response.forEach(mem => {
  //   if (mem.userId === parseJwt(token).userId) {
  //     showGroup(groups.data)
  //   }
  // })

  // grp = [];
  if (groups.data.otherGrp) {
    for (let i = 0; i < groups.data.otherGrp.length; i++) {
      // grp.push(groups.data.grpData[i].id, groups.data.grpData[i].name);
      showGroup(groups.data.otherGrp[i]);
    }
  }
  // console.log(grp);
  // showGroup(grp);
  grp = [];
  console.log(grp);
  if (groups.data.groups) {
    for (let i = 0; i < groups.data.groups.length; i++) {
      showGroup(groups.data.groups[i]);
    }
  }
});

// function grpButtonClick() {

document.getElementById("group-button").addEventListener("click", () => {
  const popup = document.querySelector(".popup-overlay");
  if (popup.style.display === "none") {
    popup.style.display = "block";
  } else {
    popup.style.display = "none";
  }

  // let isGrpBox = false;
  // if (!isGrpBox) {
  //   document.getElementById("head-tag").style.display = "none";
  //   isGrpBox = true;
  // } else {
  //   document.getElementById("head-tag").style.display = "block";
  // }
});
// }

// function grpData() {
//   const data = document.getElementById("group-create").value;
//   console.log(data);
// }

async function createGrp(e) {
  e.preventDefault();

  const groupNameInput = document.querySelector("input[name='groupName']");
  const limitInput = document.querySelector("input[name='limit']");

  const groupName = groupNameInput.value;
  const limit = limitInput.value;
  const grpData = {
    groupName,
    limit,
  };

  // Perform any validation or logic with the values
  console.log(groupName, limit);
  const groups = await axios.post("http://localhost:3000/grp/group", grpData, {
    headers: { Authorization: `Bearer ${token}` },
  });

  console.log(groups);
  if (groups.data.groups.length > 0) showGroup(groups.data.grpData);

  // Clear the input fields
  groupNameInput.value = "";
  limitInput.value = "";
  location.reload();
}

function showGroup(groups) {
  console.log(groups);
  const para = document.createElement("p");
  para.setAttribute("id", `${groups.id}`);
  const node = document.createTextNode(groups.name);
  para.appendChild(node);
  const element = document.createElement("div");
  element.setAttribute("class", "logged-in-group");
  element.appendChild(para);

  if (groups.isAdmin === true || groups.creator_id === parseJwt(token).userId) {
    const btn = document.createElement("button");
    btn.setAttribute("onclick", "showMember(event)");
    btn.setAttribute("id", `${groups.id}`);
    btn.innerHTML += "add user";
    element.appendChild(btn);
  }
  usernameElement.appendChild(element);

  const logGroup = document.querySelectorAll(".logged-in-group");
  logGroup.forEach((group) => {
    group.querySelector("p").addEventListener("click", () => {
      document.querySelector(".chat-messages").innerHTML = "";

      isChatBoxDisplayed(group.querySelector("p"));
    });
  });
  // isChatBoxDisplayed(ss);
}
let groupId;

let allMembers = [];
async function showMember(e) {
  e.preventDefault();

  console.log(e.target.getAttribute("id"));
  groupId = e.target.getAttribute("id");

  document.getElementById("member-container").style.display = "block";
  const members = await axios.get("http://localhost:3000/api/allUser", {
    headers: { Authorization: `Bearer ${token}` },
  });
  // const memberBox = document.createElement("div");
  // memberBox.setAttribute("class", "member-box");
  // memberBox.innerHTML += "All members";
  console.log(members);
  members.data.users.forEach((user) => {
    const obj = {
      username: user.username,
      id: user.id,
    };
    allMembers.push(obj);
  });
  createMemberList();
}

function closePopup() {
  document.querySelector(".popup-overlay").style.display = "none";
}

function showUsers(users) {
  // document.getElementById("username").innerHTML = parseJwt(token).username;
  for (let i = 0; i < users.length; i++) {
    const para = document.createElement("p");
    para.setAttribute("id", `${users[i].id}`);
    const node = document.createTextNode(users[i].username);
    para.appendChild(node);

    const element = document.createElement("div");
    element.setAttribute("class", "logged-in-user");
    element.appendChild(para);

    usernameElement.appendChild(element);
  }
  showMessages();
}

const showMessages = () => {
  const loggedUser = document.querySelectorAll(".logged-in-user");
  loggedUser.forEach((person) => {
    person.addEventListener("click", async function () {
      // Get the value of the id attribute
      const pElement = this.querySelector("p");
      const pId = pElement.getAttribute("id");
      // console.log(pId);
      receiverId = pId;
      sender = getUsername();
      document.querySelector(".chat-messages").innerHTML = "";
      const users = await axios.get(
        `http://localhost:3000/api/allChat?param1=${sender}&param2=${receiverId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(users);
      // const users = await axios.post(
      //   "http://localhost:3000/api/allChat",
      //   getMsgObj,
      //   {
      //     headers: { Authorization: `Bearer ${token}` },
      //   }
      // );
      if (users.data.chats.length > 0) {
        users.data.chats.forEach((chat) => {
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
          const pDate = document.createElement("p");
          pDate.setAttribute("class", "date");
          pDate.innerHTML =
            chat.updatedAt.split("T")[1].split(":", 2)[0] +
            ":" +
            chat.updatedAt.split("T")[1].split(":", 2)[1];
          div2.appendChild(pDate);
          document.querySelector(".chat-messages").appendChild(div2);
        });
        console.log(users.data.chats[0].updatedAt.split("T")[1].split(":", 2));

        const totalMsg = users.data.chats.length;
        // console.log(users.data.chats[totalMsg - 1].id);
        localStorage.setItem("lastMessage", users.data.chats[totalMsg - 1].id);
      }

      // --------------------
      console.log("person", person);
      isChatBoxDisplayed(person);
    });
  });
};

function isChatBoxDisplayed(person) {
  let isChatBoxDisplayed = false;
  document.getElementById("person-name").innerHTML = person.textContent;
  if (!isChatBoxDisplayed) {
    // Show the chat box
    document.getElementById("head-tag").style.display = "none";
    document.querySelector(".chat-box").style.display = "block";
    document.getElementById("user-name").style.display = "block";
    isChatBoxDisplayed = true;
  } else {
    // Only change the person name
    document.getElementById("person-name").innerHTML = person.textContent;
  }
}

// document.addEventListener("DOMContentLoaded", async function () {
//   const usernameElement = document.querySelector(".chat-sidebar");
//   document.getElementById("username").innerHTML = parseJwt(token).username;

//   await axios
//     .get("http://localhost:3000/api/allUser", {
//       headers: { Authorization: `Bearer ${token}` },
//     })
//     .then((response) => {
//       console.log(response.data);

//       for (let i = 0; i < response.data.users.length; i++) {
//         const para = document.createElement("p");
//         // para.setAttribute("class", "para");
//         para.setAttribute("id", `${response.data.users[i].id}`);
//         const node = document.createTextNode(response.data.users[i].username);
//         para.appendChild(node);
//         console.log(para);

//         const element = document.createElement("div");
//         element.setAttribute("class", "logged-in-user");
//         element.appendChild(para);

//         usernameElement.appendChild(element);

//         // to show chat user box
//       }
//       // let isChatBoxDisplayed = false;

//       const loggedUser = document.querySelectorAll(".logged-in-user");
//       loggedUser.forEach((person) => {
//         person.addEventListener("click", async function () {
//           // document.getElementById("head-tag").hidden = true;
//           let isChatBoxDisplayed = false;
//           // console.log(this.id);
//           // --------------------

//           // Get the value of the id attribute
//           const pElement = this.querySelector("p");
//           const pId = pElement.getAttribute("id");
//           console.log(pId);
//           receiverId = pId;

//           //---------------------
//           const getMsgObj = {
//             sender: getUsername(),
//             receiver: receiverId,
//           };
//           document.querySelector(".chat-messages").innerHTML = "";
//           const users = await axios.post(
//             "http://localhost:3000/api/allChat",
//             getMsgObj,
//             {
//               headers: { Authorization: `Bearer ${token}` },
//             }
//           );
//           console.log(users);
//           const totalMsg = users.data.chats.length;
//           console.log(users.data.chats[totalMsg - 1].id);
//           localStorage.setItem(
//             "lastMessage",
//             users.data.chats[totalMsg - 1].id
//           );

//           users.data.chats.forEach((chat) => {
//             // const div1 = document.createElement("div");
//             const div2 = document.createElement("div");

//             div2.setAttribute(
//               "class",
//               `message-${chat.fromSelf ? "sender" : "receiver"}`
//             );
//             const div3 = document.createElement("div");
//             div3.setAttribute("class", "content");

//             const pElem = document.createElement("p");
//             pElem.innerHTML = chat.message;
//             div3.appendChild(pElem);
//             div2.appendChild(div3);
//             document.querySelector(".chat-messages").appendChild(div2);
//           });
//           // --------------------
//           document.getElementById("person-name").innerHTML = person.textContent;
//           if (!isChatBoxDisplayed) {
//             // Show the chat box
//             document.getElementById("head-tag").style.display = "none";
//             document.querySelector(".chat-box").style.display = "block";
//             document.getElementById("user-name").style.display = "block";
//             isChatBoxDisplayed = true;
//           } else {
//             // Only change the person name
//             document.getElementById("person-name").innerHTML =
//               person.textContent;
//           }
//         });
//       });
//     });
// });

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
  // socket.emit("chat message", msgObj);
  inputField.value = "";
});

// ------------------------------------------------------------
// Replace this data with the actual member names fetched from the server
// const allMembers = ["John Doe", "Jane Smith", "Admin User"];

// Function to create the member list with buttons
let userId;
function createMemberList() {
  const memberListContainer = document.getElementById("member-list");
  memberListContainer.innerHTML = ""; // Clear previous list
  showMemberList();
  allMembers.forEach(async (member) => {
    const memberItem = document.createElement("div");
    memberItem.classList.add("member-item");

    const memberName = document.createElement("span");
    memberName.setAttribute("id", member.id);
    memberName.textContent = member.username;
    memberItem.appendChild(memberName);

    const addButton = document.createElement("button");
    addButton.textContent = "Add";
    addButton.setAttribute("id", `add-btn-${member.id}`);
    memberItem.appendChild(addButton);

    // addButton.setAttribute("class", "add-btn");

    // if (document.getElementById(`add-btn-${member.id}`).textContent === "Add") {
    addButton.addEventListener("click", async () => {
      // console.log(member.id);
      // Add code here to handle removing the member
      if (
        document.getElementById(`add-btn-${member.id}`).textContent === "Add"
      ) {
        userId = member.id;
        let memberObj = {
          groupId: groupId,
          userId: userId,
        };

        const members = await axios.post(
          "http://localhost:3000/grp/addMember",
          memberObj,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log(members.data);
        if (members.data.success) {
          addButton.textContent = "Remove";
          // addButton.disabled = true;
        } else {
          alert(members.data.message);
        }
      } else {
        removeUser(member.id);
      }

      // if (addButton.textContent === "Remove") {
      //   addButton.textContent = "Add";
      //   addButton.disabled = true;
      // }
    });
    // }

    const adminButton = document.createElement("button");
    adminButton.textContent = "Admin";
    adminButton.setAttribute("id", `admin-${member.id}`);
    adminButton.addEventListener("click", () => {
      // Add code here to handle making the member an admin
      console.log(`Make ${member.id} an admin`);
    });
    memberItem.appendChild(adminButton);

    memberListContainer.appendChild(memberItem);
  });
  allMembers = [];
}

// Call the function to create the member list when the page is loaded

async function showMemberList() {
  const allMembers = await axios.get(
    `http://localhost:3000/grp/get-member?param=${groupId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  let spanId = [];
  // console.log(allMembers);
  const mem = document.querySelectorAll(".member-item span");
  for (const span of mem) {
    spanId.push(Number(span.getAttribute("id")));
    // console.log(span.getAttribute("id"));
  }
  // console.log(mem);
  console.log(spanId);

  // const span_id = this.querySelector("span");
  // console.log(span_id.getAttribute("id"));

  allMembers.data.allMembers.forEach((member) => {
    spanId.forEach((id) => {
      const btn = document.getElementById(`add-btn-${id}`);
      if (id === member.userId) {
        console.log(member.userId);
        btn.textContent = "Remove";
        // btn.disabled = true;
      }
    });
    // console.log(member);
  });
}

async function removeUser(memberId) {
  console.log(memberId);
  const deleteDone = await axios.delete(
    `http://localhost:3000/grp/delete-member/:${memberId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  if (deleteDone.data.success) {
    const btn = document.getElementById(`add-btn-${memberId}`);
    btn.textContent = "Add";
  }
  console.log(deleteDone);
}
document.addEventListener("DOMContentLoaded", createMemberList);
