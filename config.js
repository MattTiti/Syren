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
            ? "price_1Pyut8CKVO6FKkF1nAAFqpN0"
            : "price_1Pyut8CKVO6FKkF1nAAFqpN0",
        name: "Monthly",
        mode: "subscription",
        description: "Daily text subscription billed monthly",
        price: 9.99,
        priceAnchor: 14.99,
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
            ? "price_1PyutiCKVO6FKkF1cSEGTzdk"
            : "price_1PyutiCKVO6FKkF1cSEGTzdk",
        name: "Yearly",
        mode: "subscription",
        description: "Daily text subscription billed yearly",
        price: 99.99,
        priceAnchor: 119.99,
        features: [
          { name: "Save an extra $20/year" },
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
