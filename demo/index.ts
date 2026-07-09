import { mount } from "../index";
import { demoEvents } from "./events";

const devtools = mount();

// Feed events the way a host app does from its agent's onEvent callback.
let index = 0;
const timer = setInterval(() => {
  devtools.onEvent(demoEvents[index]);
  index += 1;
  if (index === demoEvents.length) {
    clearInterval(timer);
  }
}, 250);
