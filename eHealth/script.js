const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
const chatbox = document.querySelector(".chatbox");
const chatbotToggler = document.querySelector(".chatbot-toggle");
const chatbotCloseBtn = document.querySelector(".chatbot-toggle");

let userMessage;
const API_KEY = "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";

const createChatLi = (message, className) => {     
  const chatLi = document.createElement("li");
  chatLi.classList.add("chat", className);
  
  let chatContent = className === "outgoing" ? `<span class="fa fa-comment"></span><p></p>` : `<p></p>`;
  chatLi.innerHTML = chatContent;
  chatLi.querySelector("p").textContent = message;

  return chatLi;
}

const generateResponse = (incomingChatLI) => {   
  const API_URL = "https://api.openai.com/v1/chat/completions";
  const messageElement = incomingChatLI.querySelector("p");

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "system", content: "You are a chatbot" }, { role: "user", content: userMessage }]
    })
  };

  fetch(API_URL, requestOptions)
    .then(res => res.json())
    .then(data => {
      messageElement.textContent = data.choices[0].message.content;
    })
    .catch((error) => {
      messageElement.textContent = "Oops! Something went wrong. Please try again";
    })
    .finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));
}

const handleChat = () => {
  userMessage = chatInput.value.trim();

  if (!userMessage) return;

  chatInput.value = "";

  chatbox.appendChild(createChatLi(userMessage, "outgoing"));
  chatbox.scrollTo(0, chatbox.scrollHeight);

  setTimeout(() => {
    const incomingChatLI = createChatLi("Thinking...", "incoming");
    chatbox.appendChild(incomingChatLI);
    chatbox.scrollTo(0, chatbox.scrollHeight);
    generateResponse(incomingChatLI);
  }, 600);
}

sendChatBtn.addEventListener("click", handleChat);
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));