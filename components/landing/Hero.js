import Image from "next/image";
import config from "@/config";
import ButtonCheckout from "@/components/ButtonCheckout";
import { Button } from "@/components/ui/button";
import { FaArrowRight } from "react-icons/fa";
import Link from "next/link";

const Hero = () => {
  return (
    <section className="max-w-7xl mx-auto bg-base-100 flex flex-col lg:flex-row items-center justify-center gap-16 lg:gap-20 px-8 py-8 lg:py-20">
      <div className="flex flex-col gap-10 lg:gap-14 items-center justify-center text-center lg:text-left lg:items-start">
        <h1 className="font-extrabold text-4xl lg:text-6xl tracking-tight md:-mb-4">
          See how much you{" "}
          <span className="italic text-violet-400">really</span> spend
        </h1>
        <p className="text-lg opacity-80 leading-relaxed">
          AI-powered expense tracking for smarter spending and saving
        </p>
        <div className="w-56">
          <ButtonCheckout
            priceId={config.stripe.plans[1].priceId}
            mode={config.stripe.plans[1].mode}
          />
        </div>
        <div className="sm:flex justify-start items-center gap-6 mt-12">
          <Link href="/demo">
            <Button
              variant="ghost"
              className="p-0 items-center dark:hover:bg-transparent dark:hover:text-violet-500 dark:text-violet-400 underline"
            >
              Check out the interactive demo
              <FaArrowRight className="ml-1 mb-0.5" size={14} />
            </Button>
          </Link>
          <Link href="/#features">
            <Button
              variant="ghost"
              className="p-0 items-center dark:hover:bg-transparent dark:hover:text-violet-500 dark:text-violet-400 underline"
            >
              Learn more about current features
              <FaArrowRight className="ml-1 mb-0.5" size={14} />
            </Button>
          </Link>
        </div>
      </div>
      <div className="lg:w-full">
        <Image
          src="/saving-3.svg"
          alt="Product Demo"
          className="w-full"
          priority={true}
          width={500}
          height={500}
        />
      </div>
    </section>
  );
};

export default Hero;
