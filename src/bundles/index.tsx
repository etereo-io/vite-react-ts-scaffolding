import { registerModule } from "@/app/modules/modules.helpers";

import locales from "./assets/locales";
import { MODULE_BUNDLES } from "./bundles.constants";
import { handlers } from "./bundles.mock.handlers";

registerModule({
  name: MODULE_BUNDLES,
  locales,
  mockHandlers: handlers,
  permissions: [],
});
