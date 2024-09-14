"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Newspaper, Cloudy, PartyPopper, Quote } from "lucide-react";
import { MdOutlineSportsBasketball } from "react-icons/md";

const features = [
  {
    title: "News",
    description:
      "Stay informed with real-time top news articles tailored to your interests. Explore content from over 150,000 global news sources, covering the latest events in your chosen categories or custom searches.",
    type: "video",
    path: "/gm-news.mp4",
    format: "video/webm",
    icon: <Newspaper />,
  },
  {
    title: "Weather",
    description:
      "Access detailed weather reports including temperature, precipitation chances, wind speed, and more. Get updates from any location worldwide, so you're always prepared.",
    type: "video",
    path: "/gm-weather.mp4",
    format: "video/webm",
    icon: <Cloudy />,
  },
  {
    title: "Sports",
    description:
      "Keep track of past and upcoming games for over 13,500 teams across more than 1,000 leagues. Never miss a match with comprehensive sports updates.",
    type: "video",
    path: "/gm-sports.mp4",
    format: "video/webm",
    icon: <MdOutlineSportsBasketball size={25} />,
  },
  {
    title: "Quotes",
    description:
      "Start your day with inspiring quotes from the world’s greatest minds—philosophers, inventors, scientists, leaders, and more. Find wisdom in every text.",
    icon: <Quote />,
    type: "video",
    path: "/gm-quotes.mp4",
    format: "video/webm",
  },
  {
    title: "Holidays",
    description:
      "Discover public, local, and bank holidays, as well as cultural observances, in more than 230 countries and 3,300 states. Plan ahead and never miss an important celebration.",
    icon: <PartyPopper />,
    type: "video",
    path: "/gm-holiday.mp4",
    format: "video/webm",
  },
];

// An SEO-friendly accordion component including the title and a description (when clicked.)
const Item = ({ feature, isOpen, setFeatureSelected }) => {
  const accordion = useRef(null);
  const { title, description, icon } = feature;

  return (
    <li>
      <button
        className="relative flex gap-2 items-center w-full py-5 text-neutral-700 font-medium text-left md:text-lg"
        onClick={(e) => {
          e.preventDefault();
          setFeatureSelected();
        }}
        aria-expanded={isOpen}
      >
        <span
          className={`duration-100 ${
            isOpen ? "text-neutral-700" : "text-neutral-500"
          }`}
        >
          {icon}
        </span>
        <span
          className={`flex-1 text-base-content ${
            isOpen ? "text-neutral-700 font-semibold" : "text-neutral-500"
          }`}
        >
          <h3 className="inline ">{title}</h3>
        </span>
      </button>

      <div
        ref={accordion}
        className={`transition-all duration-300 ease-in-out text-base-content-secondary overflow-hidden`}
        style={
          isOpen
            ? { maxHeight: accordion?.current?.scrollHeight, opacity: 1 }
            : { maxHeight: 0, opacity: 0 }
        }
      >
        <div className="pb-5 leading-relaxed">{description}</div>
      </div>
    </li>
  );
};

// A component to display the media (video or image) of the feature. If the type is not specified, it will display an empty div.
// Video are set to autoplay for best UX.
const Media = ({ feature }) => {
  const { type, path, format, alt } = feature;
  const style =
    "rounded-2xl w-full h-full object-cover border-4 border-yellow-400";
  const size = {
    width: 500,
    height: 500,
  };

  if (type === "video") {
    return (
      <div className="aspect-square w-full sm:w-[26rem] relative">
        <video
          className={style}
          autoPlay
          muted
          loop
          playsInline
          controls
          width={size.width}
          height={size.height}
        >
          <source src={path} type={format} />
        </video>
      </div>
    );
  } else if (type === "image") {
    return (
      <div className="aspect-square w-full sm:w-[26rem] relative">
        <Image
          src={path}
          alt={alt}
          className={`${style} object-cover object-center`}
          fill
        />
      </div>
    );
  } else {
    return (
      <div
        className={`${style} !border-none aspect-square w-full sm:w-[26rem]`}
      ></div>
    );
  }
};

// A component to display 2 to 5 features in an accordion.
// By default, the first feature is selected. When a feature is clicked, the others are closed.
const FeaturesAccordion = () => {
  const [featureSelected, setFeatureSelected] = useState(0);

  return (
    <section
      className="py-24 md:py-32 space-y-24 md:space-y-32 max-w-7xl mx-auto bg-yellow-50"
      id="features"
    >
      <div className="px-8">
        <h2 className="font-extrabold text-4xl lg:text-6xl tracking-tight mb-12 md:mb-24 text-neutral-700">
          End the scrolling
          <br />
          <span className="bg-yellow-500 text-white px-2 md:px-4 leading-relaxed sm:whitespace-nowrap">
            start your day off right
          </span>
        </h2>
        <div className=" flex flex-col md:flex-row gap-12 md:gap-24">
          <div className="grid grid-cols-1 items-stretch gap-8 sm:gap-12 lg:grid-cols-2 lg:gap-20">
            <ul className="w-full">
              {features.map((feature, i) => (
                <Item
                  key={feature.title}
                  index={i}
                  feature={feature}
                  isOpen={featureSelected === i}
                  setFeatureSelected={() => setFeatureSelected(i)}
                />
              ))}
            </ul>

            <Media feature={features[featureSelected]} key={featureSelected} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesAccordion;
