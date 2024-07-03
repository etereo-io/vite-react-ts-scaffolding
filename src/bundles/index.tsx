import { registerModule } from "@/app/modules/modules.helpers";

import { MODULE_BUNDLES } from "./bundles.constants";
import { handlers } from "./bundles.mock.handlers";

registerModule({
  name: MODULE_BUNDLES,
  mockHandlers: handlers,
  permissions: [],
});
