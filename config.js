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
            ? "price_1Pr8IFIEfj3N1wDkWJdwaCl7"
            : "price_1Pr8IFIEfj3N1wDkWJdwaCl7",
        name: "Yearly",
        mode: "subscription",
        description: "Full access to all features for a year",
        price: 19.99,
        priceAnchor: 29.99,
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
            ? "price_1Pr8IeIEfj3N1wDkw4Is4XzO"
            : "price_1Pr8IeIEfj3N1wDkw4Is4XzO",
        name: "Unlimited",
        mode: "payment",
        description: "A one-time payment for lifetime access",
        price: 39.99,
        priceAnchor: 49.99,
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
    fromNoReply: `BareTracking <noreply@mg.baretracking.com>`,
    fromAdmin: `Matt at BareTracking <matt@mg.baretracking.com>`,
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
