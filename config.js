import themes from "daisyui/src/theming/themes";

const config = {
  appName: "Bare Tracking",
  appDescription:
    "The expense tracker powered by OpenAI to help you save time and money",
  domainName: "baretracking.com",
  crisp: {
    id: "",
    onlyShowOnRoutes: ["/"],
  },
  stripe: {
    plans: [
      {
        priceId:
          process.env.NODE_ENV === "development"
            ? "price_1PpgaCDrCLxk48BSaW04skiO"
            : "price_1PpgaCDrCLxk48BSaW04skiO",
        name: "Yearly",
        mode: "subscription",
        description: "Full access to all features for a year",
        price: 6.99,
        priceAnchor: 11.99,
        features: [
          { name: "Smart Add" },
          { name: "Charts and Visualizations" },
          { name: "Organization Tools" },
          { name: "Access to future updates" },
        ],
        buttonMessage: "Pay now, save later.",
      },
      {
        isFeatured: true,
        priceId:
          process.env.NODE_ENV === "development"
            ? "price_1Ppfd7DrCLxk48BS08JUItmD"
            : "price_1Ppfd7DrCLxk48BS08JUItmD",
        name: "Unlimited",
        mode: "payment",
        description: "A one-time payment for lifetime access",
        price: 11.99,
        priceAnchor: 16.99,
        features: [
          { name: "Smart Add" },
          { name: "Charts and Visualizations" },
          { name: "Organization Tools" },
          { name: "Access to future updates" },
          { name: "24/7 support" },
        ],
        buttonMessage: "Pay once, save forever.",
      },
    ],
  },
  mailgun: {
    subdomain: "mg",
    fromNoReply: `ShowMeMoney <noreply@mg.baretracking.com>`,
    fromAdmin: `Matt at ShowMeMoney <matt@mg.baretracking.com>`,
    supportEmail: "matt@mg.baretracking.com",
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
