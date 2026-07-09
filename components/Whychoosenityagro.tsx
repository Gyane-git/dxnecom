import Image from "next/image";

const features = [
  {
    id: "premium-quality",
    icon: "/w1.png",
    alt: "Premium Quality",
    title: "Premium Quality",
    description:
      "Every DXN product is manufactured under strict quality standards to ensure exceptional quality, purity, and safety.",
  },
  {
    id: "ganoderma",
    icon: "/w2.png",
    alt: "Ganoderma",
    title: "Powered by Ganoderma",
    description:
      "Experience the natural benefits of Ganoderma, the signature ingredient behind DXN's world-renowned wellness products.",
  },
  {
    id: "global-trust",
    icon: "/w3.png",
    alt: "Global Trust",
    title: "Trusted Worldwide",
    description:
      "DXN has earned the trust of millions of customers in over 180 countries through innovation and quality.",
  },
  {
    id: "healthy-lifestyle",
    icon: "/w4.png",
    alt: "Healthy Lifestyle",
    title: "Healthy Lifestyle",
    description:
      "From beverages and nutrition to personal care, DXN helps you live a healthier and more balanced life every day.",
  },
];

export default function WhyChooseDXN() {
  return (
    <section className="bg-white py-12 px-4 sm:px-8 lg:px-16">
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h2
            className="text-3xl lg:text-4xl font-bold text-green-700"
            style={{ fontFamily: "Roboto Slab" }}
          >
            Why Choose DXN?
          </h2>

          <p
            className="mt-3 text-lg lg:text-2xl text-slate-600"
            style={{ fontFamily: "Roboto Slab" }}
          >
            Natural Wellness. Trusted Worldwide.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="bg-white border border-slate-200 rounded-xl p-6 text-center transition-all duration-300 hover:shadow-xl hover:border-green-300 hover:-translate-y-1"
            >
              {/* Icon */}
              <div className="flex justify-center mb-5">
                <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center">
                  <Image
                    src={feature.icon}
                    alt={feature.alt}
                    width={48}
                    height={48}
                    className="object-contain"
                  />
                </div>
              </div>

              {/* Title */}
              <h3 className="text-lg font-semibold text-slate-900 mb-3">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-sm leading-7 text-slate-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}