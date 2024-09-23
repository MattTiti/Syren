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
            ? "price_1Q0XKQCKVO6FKkF1B8A2lHBi"
            : "price_1Q0XKQCKVO6FKkF1B8A2lHBi",
        name: "Monthly",
        mode: "subscription",
        description: "Daily text subscription billed monthly",
        price: 7.99,
        priceAnchor: 12.99,
        features: [
          { name: "Daily text service" },
          { name: "Text customization" },
          { name: "Access to future updates" },
          { name: "GoodMornin Dashboard" },
        ],
        buttonMessage: "Low commitment, high reward",
      },
      {
        isFeatured: false,
        priceId:
          process.env.NODE_ENV === "development"
            ? "price_1Q0XNICKVO6FKkF1S7W2FDJQ"
            : "price_1Q0XNICKVO6FKkF1S7W2FDJQ",
        name: "Yearly",
        mode: "subscription",
        description: "Daily text subscription billed yearly",
        price: 69.99,
        priceAnchor: 99.99,
        features: [
          { name: "Save an extra $25/year" },
          { name: "Daily text service" },
          { name: "Text customization" },
          { name: "Access to future updates" },
          { name: "GoodMornin Dashboard" },
        ],
        buttonMessage: "Save money and your mornings",
      },
      {
        isFeatured: true,
        priceId:
          process.env.NODE_ENV === "development"
            ? "price_1Q2FKrCKVO6FKkF1jznbIHgw"
            : "price_1Q2FKrCKVO6FKkF1jznbIHgw",
        name: "Lifetime",
        mode: "payment",
        description: "One time payment for lifetime access",
        price: 99.99,
        priceAnchor: 129.99,
        features: [
          { name: "Pay once, no monthly fees" },
          { name: "Daily text service" },
          { name: "Text customization" },
          { name: "Access to future updates" },
          { name: "GoodMornin Dashboard" },
        ],
        buttonMessage: "Pay once, use forever",
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
  googleAnalyticsId: "G-XT1DDB8SZE",
  updates: [
    {
      title: "GoodMornin Dashboard is here!",
      description:
        "GoodMornin now offers a dashboard, so you can view your daily information from any device. On top of that, the dashboard doesn't require a text subscription, so now users can try GoodMornin for free!",
      date: "9/24/24",
    },
    {
      title: "Second Product Hunt launch!",
      description:
        "GoodMornin just launched for a second time on Product Hunt! Any support would be greatly appreciated!",
      date: "9/23/24",
      link: "https://www.producthunt.com/posts/goodmornin-2",
    },
    {
      title: "Horoscopes now available!",
      description:
        "Upon user request, horoscopes are now available! Get your daily astrological forecast. Discover what the stars have in store for you today, offering insights into your love life, career, and personal growth.",
      date: "9/19/24",
    },
    {
      title: "On This Day and Fun Facts now available!",
      description:
        "The first two new customizations are now live: On This Day and Fun Facts. On This Day allows you to travel back in time with historical events that occurred on this day. Fun Facts teaches you something new every day with our curated fun facts.",
      date: "9/18/24",
    },
    {
      title: "Product Hunt launch!",
      description:
        "GoodMornin just launched on Product Hunt! Any support would be greatly appreciated.",
      date: "9/16/24",
      link: "https://www.producthunt.com/posts/goodmornin",
    },
  ],
};

export default config;
