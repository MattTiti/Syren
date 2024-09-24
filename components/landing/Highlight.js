import Image from "next/image";
import { Badge } from "../ui/badge";
import ButtonSignIn from "@/components/ButtonSignin";

const Highlight = () => {
  return (
    <section className="flex justify-start items-center w-full text-base-content py-20 lg:py-32">
      <div className="flex flex-col w-full gap-16 md:gap-20 mx-24">
        <h2 className="max-w-3xl font-black text-neutral-700 text-4xl md:text-6xl tracking-[-0.01em]">
          View your information from{" "}
          <span className="underline decoration-dashed underline-offset-8 decoration-yellow-500">
            anywhere
          </span>
        </h2>
        <div className="flex flex-col md:flex-row gap-8 justify-between">
          <div className="rounded-2xl text-neutral-700 border border-neutral-200 bg-white flex flex-col p-6 md:w-2/5">
            <header className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-bold text-xl lg:text-3xl tracking-tight">
                  Dashboard
                </h3>
                <Badge className="bg-red-500">New</Badge>
                <Badge className="bg-green-600">Free</Badge>
              </div>
              <p className="text-sm text-neutral-600">
                Use GoodMornin in your browser
              </p>
            </header>
            <ul className="list-none space-y-2 flex-grow">
              <li className="flex items-start">
                <svg
                  className="w-5 h-5 text-green-500 mr-2 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                <span>Sign up for free, no subscription required</span>
              </li>
              <li className="flex items-start">
                <svg
                  className="w-5 h-5 text-green-500 mr-2 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                <span>Craft your own daily message</span>
              </li>
              <li className="flex items-start">
                <svg
                  className="w-5 h-5 text-green-500 mr-2 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                <span>Access to all customizations</span>
              </li>
              <li className="flex items-start">
                <svg
                  className="w-5 h-5 text-green-500 mr-2 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                <span>Access to all future updates</span>
              </li>
              <li className="flex items-start">
                <svg
                  className="w-5 h-5 text-red-500 mr-2 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
                <span>Does not include text service</span>
              </li>
            </ul>
            <footer className="mt-4">
              <ButtonSignIn />
            </footer>
          </div>

          <div className="relative md:w-1/2">
            <video
              src="/gm-dashboard.mp4"
              className="rounded-2xl border-2 border-neutral-400"
              autoPlay
              loop
              muted
              playsInline
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Highlight;
