import themes from "daisyui/src/theming/themes";

const config = {
  appName: "GoodMornin",
  appDescription:
    "The personalized daily text service delivering all the information you need to start the day",
  domainName: "goodmornin.app",
  crisp: {
    id: "",
    onlyShowOnRoutes: ["/"],
  },
  stripe: {
    plans: [
      {
        priceId:
          process.env.NODE_ENV === "development"
            ? "price_1PwVwFCKVO6FKkF1XPDPlsX5"
            : "price_1PwVwFCKVO6FKkF1XPDPlsX5",
        name: "Monthly",
        mode: "subscription",
        description: "Daily text subscription billed monthly",
        price: 6.99,
        priceAnchor: 9.99,
        features: [
          { name: "Daily text service" },
          { name: "Text customization dashboard" },
          { name: "Access to future updates" },
          { name: "24/7 support" },
        ],
        buttonMessage: "Low commitment, high reward",
      },
      {
        isFeatured: true,
        priceId:
          process.env.NODE_ENV === "development"
            ? "price_1PwmwsCKVO6FKkF1Sp6LnR2U"
            : "price_1PwmwsCKVO6FKkF1Sp6LnR2U",
        name: "Yearly",
        mode: "subscription",
        description: "Daily text subscription billed yearly",
        price: 59.99,
        priceAnchor: 79.99,
        features: [
          { name: "Save an extra $25/year" },
          { name: "Daily text service" },
          { name: "Text customization dashboard" },
          { name: "Access to future updates" },
          { name: "24/7 support" },
        ],
        buttonMessage: "Save money and your mornings",
      },
    ],
  },
  mailgun: {
    subdomain: "mg",
    fromNoReply: `GoodMornin <noreply@mg.goodmornin.app>`,
    fromAdmin: `Matt at GoodMornin <matt@mg.goodmornin.app>`,
    supportEmail: "matt@mg.goodmornin.app",
    forwardRepliesTo: "matthewtiti@gmail.com",
  },
  colors: {
    theme: "dark",
    main: themes["light"]["primary"],
    toast: "#eab308",
  },
  auth: {
    loginUrl: "/api/auth/signin",
    callbackUrl: "/custom",
  },
};

export default config;
