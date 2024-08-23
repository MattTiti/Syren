import Link from "next/link";
import ButtonCheckout from "@/components/ButtonCheckout";
import config from "@/config";

const NoPurchase = () => {
  return (
    <div className="relative h-screen flex flex-col items-center justify-center">
      <Link href="/" className="absolute top-4 left-4 btn btn-ghost">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-5 h-5"
        >
          <path
            fillRule="evenodd"
            d="M15 10a.75.75 0 01-.75.75H7.612l2.158 1.96a.75.75 0 11-1.04 1.08l-3.5-3.25a.75.75 0 010-1.08l3.5-3.25a.75.75 0 111.04 1.08L7.612 9.25h6.638A.75.75 0 0115 10z"
            clipRule="evenodd"
          />
        </svg>{" "}
        Back
      </Link>
      <h1 className="text-xl font-bold mb-4">
        Complete checkout to access dashboard
      </h1>
      <div className="flex w-full justify-center flex-col lg:flex-row items-center lg:items-stretch gap-8">
        {config.stripe.plans.map((plan) => (
          <div key={plan.priceId} className="relative w-full max-w-lg">
            {plan.isFeatured && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                <span
                  className={`badge text-xs text-primary-content font-semibold border-0 bg-primary`}
                >
                  POPULAR
                </span>
              </div>
            )}

            {plan.isFeatured && (
              <div
                className={`absolute -inset-[1px] rounded-[9px] bg-primary z-10`}
              ></div>
            )}

            <div className="relative flex flex-col h-full gap-5 lg:gap-8 z-10 bg-base-100 p-8 rounded-lg">
              <div className="flex justify-between items-center gap-4">
                <div>
                  <p className="text-lg lg:text-xl font-bold">{plan.name}</p>
                  {plan.description && (
                    <p className="text-base-content/80 mt-2">
                      {plan.description}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                {plan.priceAnchor && (
                  <div className="flex flex-col justify-end mb-[4px] text-lg ">
                    <p className="relative">
                      <span className="absolute bg-base-content h-[1.5px] inset-x-0 top-[53%]"></span>
                      <span className="text-base-content/80">
                        ${plan.priceAnchor}
                      </span>
                    </p>
                  </div>
                )}
                <p className={`text-5xl tracking-tight font-extrabold`}>
                  ${plan.price}
                </p>
                <div className="flex flex-col justify-end mb-[4px]">
                  <p className="text-xs text-base-content/60 uppercase font-semibold">
                    USD
                  </p>
                </div>
              </div>
              {plan.features && (
                <ul className="space-y-2.5 leading-relaxed text-base flex-1">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-[18px] h-[18px] opacity-80 shrink-0"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                          clipRule="evenodd"
                        />
                      </svg>

                      <span>{feature.name} </span>
                    </li>
                  ))}
                </ul>
              )}
              <div className="space-y-2">
                <ButtonCheckout priceId={plan.priceId} mode={plan.mode} />

                <p className="flex items-center justify-center gap-2 text-sm text-center text-base-content/80 font-medium relative">
                  Pay once. Access forever.
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NoPurchase;
