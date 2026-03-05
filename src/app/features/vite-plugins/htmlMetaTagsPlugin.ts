import type { Plugin } from "vite";

export function htmlMetaTagsPlugin(): Plugin {
  return {
    name: "html-meta-tags",
    transformIndexHtml(html) {
      const version = process.env.npm_package_version ?? "0.0.0";
      const timestamp = new Date().toISOString();
      const environment = process.env.NODE_ENV ?? "development";

      const metaTags = [
        `<meta name="app-version" content="${version}-${Date.now().toString(36)}">`,
        `<meta name="build-timestamp" content="${timestamp}">`,
        `<meta name="environment" content="${environment}">`
      ].join("\n    ");

      return html.replace("</head>", `    ${metaTags}\n  </head>`);
    }
  };
}
