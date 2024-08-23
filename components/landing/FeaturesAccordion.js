"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { WandSparkles, ChartSpline, Users, NotepadText } from "lucide-react";

const features = [
  {
    title: "Smart Add",
    description:
      "The Smart Add feature, powered by OpenAI, automatically processes and categorizes your financial data, saving you time and effort. Effortlessly input anything from plain text to bank statements.",
    type: "video",
    path: "/smart-add.mp4",
    format: "video/webm",
    icon: <WandSparkles />,
  },
  {
    title: "Charts",
    description:
      "Visualize your spending habits with a variety of interactive charts. Explore your data through line charts, bar charts, and pie charts, offering a clear and comprehensive view of your financial trends over time.",
    type: "video",
    path: "/charts.mp4",
    format: "video/webm",
    icon: <ChartSpline />,
  },
  {
    title: "Organization",
    description:
      "Categorize your expenses by custom categories, months, and labels, making it easy to track and manage your spending across different periods and purposes.",
    type: "video",
    path: "/organization.mp4",
    format: "video/webm",
    icon: <NotepadText />,
  },
  {
    title: "Community",
    description:
      "As a solo developer, I’m dedicated to building a product that truly serves its users. Join our community and directly influence the development of new features.",
    icon: <Users />,
    type: "image",
    path: "/community.svg",
    format: "image/svg+xml",
  },
];

// An SEO-friendly accordion component including the title and a description (when clicked.)
const Item = ({ feature, isOpen, setFeatureSelected }) => {
  const accordion = useRef(null);
  const { title, description, icon } = feature;

  return (
    <li>
      <button
        className="relative flex gap-2 items-center w-full py-5 text-base font-medium text-left md:text-lg"
        onClick={(e) => {
          e.preventDefault();
          setFeatureSelected();
        }}
        aria-expanded={isOpen}
      >
        <span className={`duration-100 ${isOpen ? "text-violet-400" : ""}`}>
          {icon}
        </span>
        <span
          className={`flex-1 text-base-content ${
            isOpen ? "text-violet-400 font-semibold" : ""
          }`}
        >
          <h3 className="inline">{title}</h3>
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
  const style = "rounded-2xl aspect-square w-full sm:w-[26rem]";
  const size = {
    width: 500,
    height: 500,
  };

  if (type === "video") {
    return (
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
    );
  } else if (type === "image") {
    return (
      <Image
        src={path}
        alt={alt}
        className={`${style} object-cover object-center`}
        width={size.width}
        height={size.height}
      />
    );
  } else {
    return <div className={`${style} !border-none`}></div>;
  }
};

// A component to display 2 to 5 features in an accordion.
// By default, the first feature is selected. When a feature is clicked, the others are closed.
const FeaturesAccordion = () => {
  const [featureSelected, setFeatureSelected] = useState(0);

  return (
    <section
      className="py-24 md:py-32 space-y-24 md:space-y-32 max-w-7xl mx-auto bg-base-100 "
      id="features"
    >
      <div className="px-8">
        <h2 className="font-extrabold text-4xl lg:text-6xl tracking-tight mb-12 md:mb-24">
          All you need to track your expenses
          <span className="bg-violet-500 text-white px-2 md:px-4 ml-1 md:ml-1.5 leading-relaxed sm:whitespace-nowrap">
            and start saving
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
