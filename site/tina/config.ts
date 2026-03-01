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
      {
        name: "reviews",
        label: "Reviews Section",
        path: "content/reviews",
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
            name: "reviews",
            label: "Reviews",
            list: true,
            fields: [
              {
                type: "string",
                name: "name",
                label: "Client Name",
              },
              {
                type: "string",
                name: "role",
                label: "Client Role",
              },
              {
                type: "string",
                name: "quote",
                label: "Quote",
                ui: {
                  component: "textarea",
                },
              },
              {
                type: "image",
                name: "img",
                label: "Client Image",
              },
            ],
          },
        ],
      },
      {
        name: "contact",
        label: "Contact Section",
        path: "content/contact",
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
          },
          {
            type: "string",
            name: "subtext",
            label: "Subtext",
          },
          {
            type: "string",
            name: "phone",
            label: "Phone Number",
          },
          {
            type: "string",
            name: "phoneDisplay",
            label: "Phone Display Text",
          },
          {
            type: "string",
            name: "email",
            label: "Email Address",
          },
          {
            type: "string",
            name: "telegramHref",
            label: "Telegram Link",
          },
          {
            type: "string",
            name: "telegramLabel",
            label: "Telegram Button Label",
          },
        ],
      },
      {
        name: "roi",
        label: "ROI Section",
        path: "content/roi",
        format: "json",
        ui: { allowedActions: { create: false, delete: false } },
        fields: [
          { type: "string", name: "headline", label: "Headline" },
          { type: "string", name: "subtext", label: "Subtext" },
          { type: "string", name: "badgeText", label: "Badge Text" },
          {
            type: "object", name: "stats", label: "Stats", list: true,
            fields: [
              { type: "string", name: "value", label: "Value" },
              { type: "string", name: "label", label: "Label" },
            ],
          },
        ],
      },
      {
        name: "results",
        label: "Results Section",
        path: "content/results",
        format: "json",
        ui: { allowedActions: { create: false, delete: false } },
        fields: [
          { type: "string", name: "headline", label: "Headline" },
          { type: "string", name: "subtext", label: "Subtext" },
          {
            type: "object", name: "cases", label: "Cases", list: true,
            fields: [
              { type: "string", name: "name", label: "Name" },
              { type: "string", name: "href", label: "TikTok Link" },
              { type: "image", name: "thumb", label: "Thumbnail" },
              { type: "string", name: "category", label: "Category" },
              { type: "string", name: "stat", label: "Stat" },
            ],
          },
        ],
      },
      {
        name: "clients",
        label: "Clients Section",
        path: "content/clients",
        format: "json",
        ui: { allowedActions: { create: false, delete: false } },
        fields: [
          { type: "string", name: "headline", label: "Headline" },
          { type: "string", name: "subtext", label: "Subtext" },
        ],
      },
    ],
  },
});