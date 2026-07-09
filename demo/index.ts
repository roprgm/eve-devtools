import { Client } from "eve/client";
import { mount } from "../index";

const devtools = mount();
const session = new Client({ host: window.location.origin }).session();

const messages = document.querySelector("main");
const form = document.querySelector("form");
const input = document.querySelector("input");
if (messages === null || form === null || input === null) {
  throw new Error("The demo page is missing its chat elements.");
}

const addMessage = (role: "user" | "assistant", text: string) => {
  const message = document.createElement("p");
  message.className = role;
  message.textContent = text;
  messages.append(message);
  messages.scrollTop = messages.scrollHeight;
  return message;
};

const send = async (text: string) => {
  input.disabled = true;
  addMessage("user", text);
  const reply = addMessage("assistant", "…");
  try {
    const response = await session.send(text);
    for await (const event of response) {
      devtools.onEvent(event);
      if (event.type === "message.appended") {
        reply.textContent = event.data.messageSoFar;
      }
      if (event.type === "message.completed" && event.data.message !== null) {
        reply.textContent = event.data.message;
      }
      messages.scrollTop = messages.scrollHeight;
    }
  } finally {
    input.disabled = false;
    input.focus();
  }
};

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const message = input.value.trim();
  if (message === "") {
    return;
  }
  input.value = "";
  void send(message);
});

void send("What's the weather in Tokyo?");
