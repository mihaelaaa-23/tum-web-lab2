import { defineConfig } from "tinacms";

export default defineConfig({
  branch: "main",
  clientId: process.env.TINA_CLIENT_ID ?? "",
  token: process.env.TINA_TOKEN ?? "",
  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },
  media: {
    tina: {
      mediaRoot: "img",
      publicFolder: "public",
    },
  },
  schema: {
    collections: [
      {
        name: "page",
        label: "Pages",
        path: "content/pages",
        format: "json",
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
          },
        ],
      },
      {
        name: "hero",
        label: "Hero Section",
        path: "content/hero",
        format: "json",
        ui: {
          allowedActions: {
            create: false,
            delete: false,
          },
        },
        fields: [
          {
            type: "string",
            name: "headline",
            label: "Headline",
            required: true,
          },
          {
            type: "string",
            name: "subtext",
            label: "Subtext",
            required: true,
          },
          {
            type: "string",
            name: "ctaLabel",
            label: "CTA Button Label",
            required: true,
          },
          {
            type: "string",
            name: "ctaHref",
            label: "CTA Button Link",
            required: true,
          },
        ],
      },
    ],
  },
});