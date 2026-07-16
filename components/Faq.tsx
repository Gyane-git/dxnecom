"use client";

import { useEffect, useState } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────
interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

// ── Default FAQs ──────────────────────────────────────────────────────────────
const faqs: FAQItem[] = [
  {
    id: 1,
    question: "What is DXN best known for?",
    answer:
      "DXN is globally recognized for its Ganoderma-based health and wellness products, including beverages, nutritional supplements, personal care, and household products.",
  },
  {
    id: 2,
    question: "Are DXN products made from natural ingredients?",
    answer:
      "Yes. DXN focuses on high-quality natural ingredients and follows strict manufacturing standards to ensure product quality, purity, and safety.",
  },
  {
    id: 3,
    question: "What is Ganoderma and why is it used in DXN products?",
    answer:
      "Ganoderma is a traditional medicinal mushroom valued for its wellness benefits. DXN incorporates premium Ganoderma into many of its products to support a healthy lifestyle.",
  },
  {
    id: 4,
    question: "How long does delivery take?",
    answer:
      "Orders are usually delivered within 3–7 business days depending on your location. Delivery times may vary during holidays or promotional periods.",
  },
  {
    id: 5,
    question: "Can I return a product?",
    answer:
      "Yes. If your product is damaged or incorrect, please contact our customer support. Returns are processed according to DXN's return policy.",
  },
];

const INITIAL_VISIBLE = 5;

// ── FAQ Row ───────────────────────────────────────────────────────────────────
function FAQRow({
  item,
  isOpen,
  onToggle,
}: {
  item: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-6 py-5 text-left"
        aria-expanded={isOpen}
      >
        <span
          className={`text-base transition-colors ${
            isOpen
              ? "text-[#1E2DD8] font-semibold"
              : "text-slate-800 font-medium"
          }`}
        >
          {item.question}
        </span>

        <span className="ml-4 text-2xl text-[#1E2DD8] font-light">
          {isOpen ? "−" : "+"}
        </span>
      </button>

      <div
        className={`grid transition-all duration-300 ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <p className="px-6 pb-6 text-sm leading-7 text-[#000000]">
            {item.answer}
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Main FAQ Section ──────────────────────────────────────────────────────────
export default function FAQ() {
  const [openId, setOpenId] = useState<number | null>(1);
  const [showAll, setShowAll] = useState(false);
  const [apiFaqs, setApiFaqs] = useState<FAQItem[]>(faqs);

  useEffect(() => {
    const loadFaqs = async () => {
      try {
        const response = await fetch("/api/faqs?homeOnly=true&limit=5", {
          cache: "no-store",
        });

        const payload = await response.json();

        if (!response.ok || !payload?.success) return;

        const rows = Array.isArray(payload.data) ? payload.data : [];

        if (!rows.length) return;

        setApiFaqs(
          rows.slice(0, 5).map((item: any) => ({
            id: Number(item.id || item.faqsId),
            question: item.question,
            answer: item.answer || "",
          })),
        );
      } catch {
        // fallback
      }
    };

    loadFaqs();
  }, []);

  const visibleFaqs = showAll ? apiFaqs : apiFaqs.slice(0, INITIAL_VISIBLE);

  const toggle = (id: number) => setOpenId((prev) => (prev === id ? null : id));

  return (
    <section className="bg-white py-12 px-4 sm:px-8 lg:px-16">
      {/* Heading */}
      <div className="text-center mb-12">
        <h2
          className="text-3xl lg:text-4xl font-bold text-[#1E2DD8] mb-4"
          style={{ fontFamily: "Roboto Slab" }}
        >
          Frequently Asked Questions
        </h2>

        <p className="mt-3 text-[#000000] text-lg">
          Everything you need to know about DXN products and services.
        </p>
      </div>

      {/* FAQ List */}
      <div className="max-w-4xl mx-auto space-y-4">
        {visibleFaqs.map((item) => (
          <FAQRow
            key={item.id}
            item={item}
            isOpen={openId === item.id}
            onToggle={() => toggle(item.id)}
          />
        ))}
      </div>

      {/* Button */}
      {apiFaqs.length > INITIAL_VISIBLE && (
        <div className="flex justify-center mt-10">
          <button
            onClick={() => setShowAll((prev) => !prev)}
            className="px-8 py-3 rounded-lg bg-green-700 hover:bg-green-800 text-white font-semibold transition-all duration-300"
          >
            {showAll ? "See Less" : "See More"}
          </button>
        </div>
      )}
    </section>
  );
}
