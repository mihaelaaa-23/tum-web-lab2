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
      {
        name: "services",
        label: "Services Section",
        path: "content/services",
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
            label: "Section Headline",
          },
          {
            type: "string",
            name: "subtext",
            label: "Section Subtext",
          },
          {
            type: "object",
            name: "packages",
            label: "Packages",
            list: true,
            fields: [
              {
                type: "string",
                name: "name",
                label: "Package Name",
              },
              {
                type: "string",
                name: "badge",
                label: "Badge",
              },
              {
                type: "string",
                name: "tagline",
                label: "Tagline (back of card)",
              },
              {
                type: "string",
                name: "features",
                label: "Features",
                list: true,
              },
              {
                type: "string",
                name: "featuresText",
                label: "Features Text (for custom package)",
              },
              {
                type: "string",
                name: "ctaLabel",
                label: "CTA Label",
              },
            ],
          },
        ],
      },
    ],
  },
});