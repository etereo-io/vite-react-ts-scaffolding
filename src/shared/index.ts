import { registerModule } from "@/app/features/modules/modules.helpers";

import locales from "./assets/locales";
import { MODULE_SHARED } from "./shared.constants";

registerModule({
  name: MODULE_SHARED,
  locales
});
