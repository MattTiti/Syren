/* eslint-disable @next/next/no-img-element */
"use client";

import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import config from "@/config";
import { Button } from "@/components/ui/button";
import { ArrowBigRightDash } from "lucide-react";

const ButtonSignin = ({ text = "Get started" }) => {
  const router = useRouter();
  const { data: status } = useSession();

  const handleClick = () => {
    if (status) {
      router.push(config.auth.callbackUrl);
    } else {
      signIn(undefined, { callbackUrl: config.auth.callbackUrl });
    }
  };

  if (status) {
    return (
      <Button
        className="w-full p-6 group bg-white text-neutral-700 border border-yellow-500 hover:bg-neutral-100"
        onClick={() => router.push(config.auth.callbackUrl)}
      >
        Customize{" "}
        <ArrowBigRightDash size={16} className="ml-2 group-hover:scale-110" />
      </Button>
    );
  }

  return (
    <Button
      className="w-full p-6 group bg-white text-neutral-700 border border-yellow-500 hover:bg-neutral-100"
      onClick={handleClick}
    >
      {text}
    </Button>
  );
};

export default ButtonSignin;
