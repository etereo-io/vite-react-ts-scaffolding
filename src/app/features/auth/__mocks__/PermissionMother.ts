import { getModules } from "@/app/features/modules/modules.helpers";

export class PermissionMother {
  static getAll() {
    return getModules()
      .filter((module) => module.permissions)
      .flatMap((module) => module.permissions) as string[];
  }

  static getAllByModuleName(module: string) {
    return getModules().find((m) => m.name === module)?.permissions ?? [];
  }
}
