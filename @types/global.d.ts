declare module "*.md";
declare module "*.jpg";
declare module "*.png";
declare module "*.ico";
declare module "*.svg" {
  const content: string;
  export default content;
}
declare module "*?raw";
