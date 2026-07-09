import { localDev, none } from "eve/channels/auth";
import { eveChannel } from "eve/channels/eve";

// This is a public demo, so anonymous traffic is accepted on purpose.
export default eveChannel({
  auth: [localDev(), none()],
});
