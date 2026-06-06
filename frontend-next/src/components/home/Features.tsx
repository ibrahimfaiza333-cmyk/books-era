"use client";

import { ShieldCheck, Truck, Banknote, Library } from "lucide-react";

const features = [
  {
    title: "Top Trusted",
    subtitle: "Trusted by thousands of readers",
    icon: ShieldCheck,
  },
  {
    title: "7 Days Delivery",
    subtitle: "Fast delivery all over Pakistan",
    icon: Truck,
  },
  {
    title: "Cash on Delivery",
    subtitle: "Pay when you receive your order",
    icon: Banknote,
  },
  {
    title: "500+ Books",
    subtitle: "Wide collection of books available",
    icon: Library,
  },
];

const Features = () => {
  return (
    <section className="w-full flex justify-center border-b border-gray-100" style={{ backgroundColor: '#fff8f2', paddingTop: '80px', paddingBottom: '80px' }}>
      <div className="w-full max-w-[1280px]" style={{ paddingLeft: '16px', paddingRight: '16px' }}>
        <style>{`
          .feature-card {
            padding: 16px 8px;
            width: calc(50% - 10px);
            max-width: 280px;
            min-width: 140px;
          }
          .feature-icon-wrapper {
            margin-bottom: 12px;
          }
          @media (min-width: 640px) {
            .feature-card {
              padding: 24px 12px;
              width: calc(50% - 10px);
            }
            .feature-icon-wrapper {
              margin-bottom: 16px;
            }
          }
        `}</style>
        <div className="flex flex-wrap justify-center w-full" style={{ gap: 20 }}>
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="feature-card group flex flex-col items-center justify-center text-center bg-white rounded-[16px] sm:rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_40px_rgba(225,113,28,0.15)] border border-orange-50/50 transition-all duration-300 hover:-translate-y-2 cursor-pointer"
              >
                <div 
                  className="feature-icon-wrapper w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#e1711c] flex items-center justify-center shadow-[0_4px_16px_rgba(225,113,28,0.3)] group-hover:scale-110 transition-transform duration-300 ring-4 ring-orange-100/50 ring-offset-2 sm:ring-offset-4 ring-offset-white"
                >
                  <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" strokeWidth={2.5} />
                </div>
                <h3 className="text-[15px] sm:text-xl font-bold text-[#131921] mb-2 sm:mb-4">{feature.title}</h3>
                <p className="text-[11px] sm:text-sm text-gray-500 leading-snug sm:leading-relaxed">
                  {feature.subtitle}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;