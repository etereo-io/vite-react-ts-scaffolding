import { getModules } from "@/app/features/modules/modules.helpers";

export const PermissionMother = {
  getMockPermissions: () => {
    return getModules()
      .filter((module) => module.permissions)
      .flatMap((module) => module.permissions) as string[];
  },
  getAllByModuleName: (module: string) => {
    return getModules().find((m) => m.name === module)?.permissions ?? [];
  }
};
