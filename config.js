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
        description: "Full access to all features for a year",
        price: 8.99,
        priceAnchor: 14.99,
        features: [
          { name: "All tracking features" },
          { name: "Verified food options" },
          { name: "Intake Charts" },
          { name: "Access to future updates" },
          { name: "24/7 support" },
        ],
        buttonMessage: "A yearly subscription at a monthly price",
      },
      {
        isFeatured: true,
        priceId:
          process.env.NODE_ENV === "development"
            ? "price_1PwVxSCKVO6FKkF1uKCFg9o8"
            : "price_1PwVxSCKVO6FKkF1uKCFg9o8",
        name: "Yearly",
        mode: "subscription",
        description: "A one-time payment for lifetime access",
        price: 79.99,
        priceAnchor: 119.99,
        features: [
          { name: "All tracking features" },
          { name: "Verified food options" },
          { name: "Intake Charts" },
          { name: "Access to future updates" },
          { name: "24/7 support" },
        ],
        buttonMessage: "Pay once, own forever",
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
    toast: "#000000",
  },
  auth: {
    loginUrl: "/api/auth/signin",
    callbackUrl: "/custom",
  },
};

export default config;
