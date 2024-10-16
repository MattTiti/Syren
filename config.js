import themes from "daisyui/src/theming/themes";

const config = {
  appName: "Syren",
  appDescription:
    "The personalized daily messaging service delivering all the information you need to start the day",
  domainName: "syrensend.com",
  crisp: {
    id: "",
    onlyShowOnRoutes: ["/"],
  },
  stripe: {
    plans: [
      {
        priceId:
          process.env.NODE_ENV === "development"
            ? "price_1Q4jjPCKVO6FKkF1pPndI3hV"
            : "price_1Q4jjPCKVO6FKkF1pPndI3hV",
        name: "Monthly",
        mode: "subscription",
        description: "Daily text subscription billed monthly",
        price: 3.99,
        priceAnchor: 7.99,
        features: [
          { name: "Daily message service (Text & Email)" },
          { name: "Message customization" },
          { name: "GoodMornin Dashboard" },
        ],
        buttonMessage: "Low commitment, high reward",
      },
      {
        isFeatured: false,
        priceId:
          process.env.NODE_ENV === "development"
            ? "price_1Q4jicCKVO6FKkF18qgeLu3F"
            : "price_1Q4jicCKVO6FKkF18qgeLu3F",
        name: "Yearly",
        mode: "subscription",
        description: "Daily text subscription billed yearly",
        price: 39.99,
        priceAnchor: 69.99,
        features: [
          { name: "Save an extra 20% per year" },
          { name: "Daily message service (Text & Email)" },
          { name: "Message customization" },
          { name: "GoodMornin Dashboard" },
        ],
        buttonMessage: "Save money and your mornings",
        // yearlyPrice: true,
        perMonthPrice: 2.99,
      },
      {
        isFeatured: true,
        priceId:
          process.env.NODE_ENV === "development"
            ? "price_1Q4jkxCKVO6FKkF1kCOrIGGh"
            : "price_1Q4jkxCKVO6FKkF1kCOrIGGh",
        name: "Lifetime",
        mode: "payment",
        description: "One time payment for lifetime access",
        price: 69.99,
        priceAnchor: 99.99,
        features: [
          { name: "Pay once, no monthly fees" },
          { name: "Daily message service (Text & Email)" },
          { name: "Message customization" },
          { name: "GoodMornin Dashboard" },
        ],
        buttonMessage: "Pay once, use forever",
      },
    ],
  },
  mailgun: {
    subdomain: "mg",
    fromNoReply: `Syren <noreply@mg.syrensend.com>`,
    fromAdmin: `Matt at Syren <matt@mg.syrensend.com>`,
    supportEmail: "matt@mg.syrensend.com",
    forwardRepliesTo: "matthewtiti@gmail.com",
  },
  colors: {
    theme: "dark",
    main: themes["dark"]["primary"],
    toast: "#047857",
  },
  auth: {
    loginUrl: "/api/auth/signin",
    callbackUrl: "/custom",
  },
  googleAnalyticsId: "",
  updates: [
    {
      title: "New Pricing (30% off) + Air Quality!",
      description:
        "GoodMornin prices are now reduced by 30%! How and why did we do this?\n\nGoodMornin's price was based on the assumption that some users may want a long daily message with tons of customization, but this isn't the case for most users. Most users can get everything they want in one text with space to spare. So we're setting a limit of two texts per day (which 99% of users will never go over) and reducing the price for everyone. If you ever exceed this limit, don't worry, your text will include a link to the dashboard to view the rest of your message.\n\nWhat if you already paid? That's fine, we appreciate you too and will happily refund you the difference! Just reach out by email (matt@mg.goodmornin.app).\n\nOn top of that, we have two more updates:\n1. Air Quality has now been added to Weather\n2. News links are now optional",
      date: "9/30/24",
    },
    {
      title: "New Updates!",
      description:
        "Based on your feedback, several updates have been made to GoodMornin in the past week! Here are the highlights:\n\n1. Email delivery\n2. League Recaps (Get all last night's games)\n3. Improved mobile compatibility\n4. Improved text message delivery and multiple bug fixes\n\nAnd there are more updates on the way, so stay tuned! ",
      date: "9/28/24",
    },
    {
      title: "Introducing GoodMornin Emails!",
      description:
        "GoodMornin now offers email delivery! You can now get your daily message sent to your email inbox. All you need to do is fill out the email settings in the customization page.",
      date: "9/28/24",
    },
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
