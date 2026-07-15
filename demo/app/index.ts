import {
  Client,
  type InputOption,
  type InputRequest,
  type SendTurnInput,
} from "eve/client";
import { mount } from "../../index";

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

const createOptionButton = (request: InputRequest, option: InputOption) => {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = option.label;
  button.addEventListener("click", () => {
    const siblings = button.parentElement?.querySelectorAll("button") ?? [];
    for (const sibling of siblings) {
      sibling.disabled = true;
    }
    const response = { requestId: request.requestId, optionId: option.id };
    devtools.onEvent({
      type: "client.input.responded",
      data: { responses: [response] },
    });
    void send(option.label, {
      inputResponses: [response],
    });
  });
  return button;
};

const renderInputRequests = (
  reply: HTMLParagraphElement,
  requests: readonly InputRequest[],
) => {
  reply.replaceChildren();
  reply.classList.add("question");
  for (const request of requests) {
    const prompt = document.createElement("span");
    prompt.textContent = request.prompt;
    reply.append(prompt);
    if (request.options !== undefined && request.options.length > 0) {
      const options = document.createElement("span");
      options.className = "options";
      options.append(
        ...request.options.map((option) => createOptionButton(request, option)),
      );
      reply.append(options);
    }
  }
};

const send = async (text: string, turnInput: SendTurnInput = text) => {
  input.disabled = true;
  addMessage("user", text);
  const reply = addMessage("assistant", "…");
  try {
    const response = await session.send(turnInput);
    for await (const event of response) {
      devtools.onEvent(event);
      if (event.type === "message.appended") {
        reply.textContent = event.data.messageSoFar;
      }
      if (event.type === "message.completed" && event.data.message !== null) {
        reply.textContent = event.data.message;
      }
      if (event.type === "input.requested") {
        renderInputRequests(reply, event.data.requests);
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
