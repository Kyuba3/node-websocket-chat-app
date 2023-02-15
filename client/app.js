const socket = io();
socket.on('message', ({author, content}) => addMessage(author, content));

const loginForm = document.querySelector("#welcome-form");
const messagesSection = document.querySelector("#messages-section");
const messageList = document.querySelector("#messages-list");
const addMessageForm = document.querySelector("#add-messages-form");
const userNameInput = document.querySelector("#username");
const messageContentInput = document.querySelector("#message-content");

let userName = "";

const login = (e) => {
  e.preventDefault();
  if(userNameInput.value.length > 0) {
    userName = userNameInput.value;
    loginForm.classList.remove("show");
    messagesSection.classList.add("show");
    addMessageForm.classList.add("show");
  } else {
    alert("Enter a username");
  }
};

const sendMessage = (e) => {
  e.preventDefault();
  if(messageContentInput.value.length <= 0){
    alert('message is empty');
  } else {
    addMessage(userName, messageContentInput.value);
    socket.emit('message', { author: userName, content: messageContentInput.value });
    messageContentInput.value = '';
  }
}

const addMessage = (author, content) => {
  const message = document.createElement('li');
  message.classList.add('message');
  message.classList.add('message--recieved');
  if(author === userName){
    message.classList.add('message--self');
  }
  message.innerHTML = 
    `<h3 class="message__author">${userName === author ? 'You' : author}</h3>
     <div class="message__content">
      ${content}
     </div>
    `;
  messageList.appendChild(message);
}

loginForm.addEventListener("submit", (e) => login(e));
addMessageForm.addEventListener("submit", (e) => sendMessage(e));
