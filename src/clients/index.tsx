import { registerModule } from "@/app/modules/modules.helpers";

import { MODULE_CLIENTS } from "./clients.constants";
import { handlers } from "./clients.mock.handlers";

registerModule({
  name: MODULE_CLIENTS,
  mockHandlers: handlers,
});
