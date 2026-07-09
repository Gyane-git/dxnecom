"use client";

import Image from "next/image";

export default function ShopCTABanner() {
  return (
    <section className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 pt-8 sm:pt-10 lg:pt-12">
      <div
        className="
          relative overflow-visible
          grid grid-cols-1 lg:grid-cols-2
          items-center
          h-[224px]
          rounded-3xl
          px-6 sm:px-10 lg:px-14
        "
        style={{
          backgroundImage: `
            linear-gradient(rgba(240,253,244,0.95), rgba(255,255,255,0.95)),
            url('/bg.png')
          `,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* LEFT CONTENT */}
        <div className="relative z-10 max-w-[560px]">
          <h2
            className="text-slate-900 font-bold text-3xl leading-tight"
            style={{ fontFamily: "Roboto Slab, serif" }}
          >
            Begin Your Wellness Journey with DXN
          </h2>

          <p className="mt-4 text-slate-600 text-base leading-7">
            Subscribe today to receive exclusive offers, wellness tips,
            and updates on authentic DXN products.
          </p>

          {/* Email Box */}
          <div className="mt-7 flex items-center bg-white rounded-full overflow-hidden shadow-md border border-green-100 max-w-[420px] h-[48px]">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 h-full px-5 text-sm text-slate-700 bg-transparent outline-none placeholder:text-slate-400"
            />

            <button
              className="
                h-full
                px-8
                bg-green-700
                hover:bg-green-800
                text-white
                text-sm
                font-semibold
                transition-all
                duration-300
              "
            >
              Subscribe
            </button>
          </div>
        </div>

        {/* RIGHT IMAGES */}
        <div className="relative hidden lg:block h-full">
          {/* Background Product */}
          <div className="absolute right-[165px] top-[-270px] w-[300px] h-[600px] z-10 overflow-visible">
            <Image
              src="/b2.png"
              alt="DXN Products"
              fill
              className="object-contain scale-x-[-1]"
            />
          </div>

          {/* Front Product */}
          <div className="absolute right-[-55px] top-[-115px] w-[300px] h-[360px] z-20 overflow-hidden">
            <Image
              src="/b1.png"
              alt="DXN Wellness Products"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}