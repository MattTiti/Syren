import Image from "next/image";

const WithWithout = () => {
  return (
    <section className="bg-stone-950 py-16 md:py-32" id="comp">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-4 mb-12 md:mb-10 items-center">
          <h2 className="text-end font-extrabold text-3xl md:text-5xl tracking-tight md:col-span-2 text-base-content/80">
            Top Competitor
          </h2>
          <div className="text-center font-bold text-2xl md:text-4xl text-gray-500">
            vs.
          </div>
          <h2 className="text-start font-extrabold text-3xl md:text-5xl tracking-tight md:col-span-2 text-yellow-400">
            Bare Tracking
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 px-16">
          <ComparisonColumn
            items={[
              "$19.99/month or $79.99/year",
              "Includes unverified food options",
              "Inflexible food and meal structures",
              "Countless useless features",
              "Too many pages and a confusing UI ",
            ]}
            iconType="cross"
            bgColor="bg-error/20"
            textColor="text-error"
            imageSrc="/myfit-icon.jpeg"
            extraStyle="blur-lg"
          />
          <ComparisonColumn
            items={[
              "$19.99/year or one-time payment of $39.99",
              "Over 1.9 million verified food options",
              "Flexible food and meal structures",
              "All the features you need and none you don't",
              "Everything you need in one easy-to-use dashboard",
            ]}
            iconType="check"
            bgColor="bg-success/20"
            textColor="text-success"
            imageSrc="/icon.png"
          />
        </div>
      </div>
    </section>
  );
};

const ComparisonColumn = ({
  items,
  iconType,
  bgColor,
  textColor,
  imageSrc,
  extraStyle,
}) => (
  <div className="flex flex-col h-full">
    <div className="w-full mb-6 flex justify-center items-center">
      <Image
        src={imageSrc}
        alt="Product icon"
        height={400}
        width={400}
        objectFit="cover"
        className={`rounded-lg ${extraStyle}`}
      />
    </div>
    <div className={`${bgColor} ${textColor} p-8 rounded-lg flex-grow`}>
      <ul className="space-y-3">
        {items.map((item, index) => (
          <li key={index} className="flex items-start">
            <Icon type={iconType} className="mt-1 mr-3 flex-shrink-0" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

const Icon = ({ type, className }) => {
  if (type === "cross") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        fill="currentColor"
        className={`w-4 h-4 ${className}`}
      >
        <path d="M5.28 4.22a.75.75 0 0 0-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 1 0 1.06 1.06L8 9.06l2.72 2.72a.75.75 0 1 0 1.06-1.06L9.06 8l2.72-2.72a.75.75 0 0 0-1.06-1.06L8 6.94 5.28 4.22Z" />
      </svg>
    );
  } else {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        fill="currentColor"
        className={`w-4 h-4 ${className}`}
      >
        <path
          fillRule="evenodd"
          d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z"
          clipRule="evenodd"
        />
      </svg>
    );
  }
};

export default WithWithout;
