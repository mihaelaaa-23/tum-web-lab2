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
          { type: "string", name: "handNote", label: "Hand note", required: true },
          { type: "string", name: "headlineBefore", label: "Headline (before highlight)", required: true },
          { type: "string", name: "headlineHighlight", label: "Headline (highlighted)", required: true },
          { type: "string", name: "headlineAfter", label: "Headline (after highlight)", required: true },
          { type: "string", name: "subtext", label: "Subtext", required: true },
          { type: "string", name: "ctaLabel", label: "CTA Button Label", required: true },
          { type: "string", name: "ctaHref", label: "CTA Button Link", required: true },
          { type: "image", name: "portrait", label: "Portrait", required: true },
          {
            type: "object",
            name: "stats",
            label: "Stats",
            list: true,
            ui: { itemProps: (item) => ({ label: item?.value }) },
            fields: [
              { type: "string", name: "value", label: "Value", required: true },
              { type: "string", name: "label", label: "Label", required: true },
            ],
          },
          {
            type: "object",
            name: "polaroids",
            label: "Polaroids",
            list: true,
            ui: { itemProps: (item) => ({ label: item?.note }) },
            fields: [
              { type: "image", name: "img", label: "Image", required: true },
              { type: "string", name: "note", label: "Handwritten note", required: true },
              { type: "string", name: "alt", label: "Alt text", required: true },
            ],
          },
        ],
      },
      {
        name: "doors",
        label: "Audience Doors",
        path: "content/doors",
        format: "json",
        ui: {
          allowedActions: {
            create: false,
            delete: false,
          },
        },
        fields: [
          {
            type: "object",
            name: "doors",
            label: "Doors",
            list: true,
            ui: { itemProps: (item) => ({ label: item?.label }) },
            fields: [
              { type: "string", name: "label", label: "Label", required: true },
              { type: "string", name: "sub", label: "Subtext", required: true },
              { type: "string", name: "tab", label: "Services tab", required: true, options: ["local", "brand"] },
            ],
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
            ui: {
              itemProps: (item) => ({
                label: item?.name
                  ? item.hidden
                    ? `${item.name} (hidden)`
                    : item.name
                  : "Package",
              }),
            },
            fields: [
              {
                type: "string",
                name: "name",
                label: "Package Name",
              },
              {
                type: "string",
                name: "audience",
                label: "Audience",
                options: [
                  { value: "local", label: "Afacere locală" },
                  { value: "brand", label: "Brand în creștere" },
                ],
              },
              {
                type: "string",
                name: "promise",
                label: "Promise (one line)",
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
              {
                type: "boolean",
                name: "popular",
                label: 'Show "cel mai ales" sticker',
              },
              {
                type: "boolean",
                name: "hidden",
                label: "Hide this package",
              },
            ],
          },
        ],
      },
      {
        name: "reviewsSection",
        label: "Reviews Section Settings",
        path: "content/reviews-section",
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
        ],
      },
      {
        name: "review",
        label: "Reviews",
        path: "content/reviews",
        format: "md",
        fields: [
          {
            type: "string",
            name: "name",
            label: "Client Name",
            required: true,
          },
          {
            type: "string",
            name: "role",
            label: "Client Role / Company",
            required: true,
          },
          {
            type: "image",
            name: "img",
            label: "Client Image",
          },
          {
            type: "rich-text",
            name: "body",
            label: "Quote",
            isBody: true,
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
        name: "results",
        label: "Results Section",
        path: "content/results",
        format: "json",
        ui: { allowedActions: { create: false, delete: false } },
        fields: [
          { type: "string", name: "headline", label: "Headline" },
          { type: "string", name: "subtext", label: "Subtext" },
          {
            type: "object", name: "featured", label: "Featured Case",
            fields: [
              { type: "string", name: "label", label: "Label" },
              { type: "string", name: "headline", label: "Headline" },
              {
                type: "object", name: "stats", label: "Stats", list: true,
                ui: { itemProps: (item) => ({ label: item?.label || "Stat" }) },
                fields: [
                  { type: "string", name: "value", label: "Value" },
                  { type: "string", name: "label", label: "Label" },
                ],
              },
            ],
          },
          {
            type: "object", name: "cases", label: "Cases", list: true,
            ui: {
              itemProps: (item) => ({
                label: item?.name
                  ? item.hidden
                    ? `${item.name} (hidden)`
                    : item.name
                  : "Case",
              }),
            },
            fields: [
              { type: "string", name: "name", label: "Name" },
              { type: "string", name: "href", label: "TikTok Link" },
              { type: "image", name: "thumb", label: "Thumbnail" },
              { type: "string", name: "category", label: "Category" },
              { type: "string", name: "note", label: "Caption (handwritten)" },
              { type: "boolean", name: "hidden", label: "Hide this case" },
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
          {
            type: "object", name: "clients", label: "Client Logos", list: true,
            ui: {
              itemProps: (item) => ({
                label: item?.alt
                  ? item.hidden
                    ? `${item.alt} (hidden)`
                    : item.alt
                  : "Client",
              }),
            },
            fields: [
              { type: "image", name: "img", label: "Logo Image" },
              { type: "string", name: "alt", label: "Alt Text (client name)" },
              { type: "boolean", name: "hidden", label: "Hide this client" },
            ],
          },
        ],
      },
      {
        name: "process",
        label: "Process Section",
        path: "content/process",
        format: "json",
        ui: { allowedActions: { create: false, delete: false } },
        fields: [
          { type: "string", name: "headline", label: "Headline" },
          {
            type: "object", name: "steps", label: "Steps", list: true,
            ui: { itemProps: (item) => ({ label: item?.title || "Step" }) },
            fields: [
              { type: "string", name: "title", label: "Title" },
              { type: "string", name: "text", label: "Text" },
            ],
          },
        ],
      },
      {
        name: "journal",
        label: "Journal (TikTok)",
        path: "content/journal",
        format: "json",
        ui: { allowedActions: { create: false, delete: false } },
        fields: [
          { type: "string", name: "headline", label: "Headline" },
          { type: "string", name: "handle", label: "TikTok handle (leave empty to hide the section)" },
          { type: "string", name: "profileUrl", label: "Profile URL" },
          {
            type: "object", name: "tiles", label: "Tiles", list: true,
            ui: { itemProps: (item) => ({ label: item?.caption || "Tile" }) },
            fields: [
              { type: "image", name: "img", label: "Image (9:16)" },
              { type: "string", name: "url", label: "Video URL" },
              { type: "string", name: "caption", label: "Caption" },
            ],
          },
        ],
      },
    ],
  },
});
