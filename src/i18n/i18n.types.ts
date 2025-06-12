export enum Locale {
  EN = "en",
  ES = "es"
}

export type LocaleResources = Record<
  Locale,
  { translation: Record<string, string> }
>;
