import themes from "daisyui/src/theming/themes";

const config = {
  appName: "GoodMornin",
  appDescription:
    "A bare bones macro tracker with everything you need and nothing you don’t",
  domainName: "goodmornin.app",
  crisp: {
    id: "",
    onlyShowOnRoutes: ["/"],
  },
  stripe: {
    plans: [
      {
        priceId: process.env.NODE_ENV === "development" ? "" : "",
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
        priceId: process.env.NODE_ENV === "development" ? "" : "",
        name: "Yearly",
        mode: "payment",
        description: "A one-time payment for lifetime access",
        price: 89.99,
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
    callbackUrl: "/dashboard",
  },
};

export default config;
