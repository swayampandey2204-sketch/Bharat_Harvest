'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function Home() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { root: null, rootMargin: '0px', threshold: 0.1 }
    );
    document.querySelectorAll('.reveal-section, .stagger-card').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="bg-[#0c1e0e] text-[#f0ead6] min-h-screen flex flex-col font-body-md antialiased">
      <Navbar />

      <main className="flex-grow">

        {/* ── HERO ── */}
        <section className="w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-16 md:py-28 flex flex-col md:flex-row items-center gap-12 min-h-[75vh]">
          {/* Copy */}
          <div className="flex-1 flex flex-col items-start justify-center pr-0 md:pr-12">
            <span className="text-[#c89030] text-[11px] font-bold uppercase tracking-[0.2em] mb-5 block">
              Premium Lotus Seeds
            </span>
            <h1 className="font-headline text-[38px] md:text-[56px] leading-[1.08] text-[#f0ead6] mb-6 tracking-tight">
              Honoring Heritage.{' '}
              <br />
              <span className="italic font-light text-[#c89030]">Crafting Wellness.</span>
            </h1>
            <p className="text-[17px] text-[#a8c098] mb-10 max-w-xl leading-relaxed">
              Discover Bharat Harvest's Gold Grade lotus seeds. Meticulously hand-harvested from natural wetlands and popped with pure precision for a subtle, gourmet crunch.
            </p>
            <div className="flex gap-4 flex-wrap">
              <Link
                href="/shop"
                className="bg-[#c89030] text-[#0c1e0e] font-semibold text-[15px] px-8 py-3.5 rounded-full inline-block hover:bg-[#e8b848] active:scale-98 transition-all shadow-[0_6px_20px_rgba(200,144,48,0.35)]"
              >
                Shop Catalog
              </Link>
              <Link
                href="/about"
                className="btn-minimal-secondary font-semibold text-[15px] px-8 py-3.5 rounded-full inline-block"
              >
                Our Heritage
              </Link>
            </div>
          </div>

          {/* Hero Image */}
          <div className="flex-1 w-full relative h-[360px] md:h-[500px] rounded-2xl overflow-hidden border border-[#c89030]/20 shadow-[0_24px_60px_rgba(0,0,0,0.5)] mt-8 md:mt-0 bg-[#041909] flex items-center justify-center">
            <img
              alt="Bharat Harvest Organic"
              className="w-full h-full object-contain"
              src="/images/bharat-harvest-logo-hero-dark.jpg"
            />
            {/* Subtle gold vignette overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0c1e0e]/20 via-transparent to-transparent pointer-events-none"></div>
          </div>
        </section>

        {/* ── GOLD DIVIDER ── */}
        <div className="gold-divider opacity-30 mx-margin-mobile md:mx-margin-desktop"></div>

        {/* ── BRAND HIGHLIGHTS ── */}
        <section className="w-full bg-[#0e2010] py-16 md:py-24 border-t border-b border-[#c89030]/10">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
            <div className="text-center mb-16 max-w-2xl mx-auto reveal-section">
              <span className="text-[#c89030] text-[11px] font-bold uppercase tracking-[0.2em] mb-3 block">Sourcing Standards</span>
              <h2 className="font-headline text-[30px] md:text-[40px] text-[#f0ead6] mb-4">Harvest to Bowl</h2>
              <p className="text-[#a8c098] leading-relaxed text-[16px]">
                We maintain direct trade partnerships with wetland farmers, preserving traditional popping methods while enforcing strict quality controls.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
              {[
                {
                  title: '100% Organic Sourcing',
                  body: 'Ethically gathered from natural ponds, preserving the delicate local wetland ecosystems of Bihar.',
                  delay: 'delay-100',
                },
                {
                  title: 'Wood-Fired Roasting',
                  body: 'Dry-roasted in traditional clay pots to achieve that clean, signature crunch without any heavy frying oils.',
                  delay: 'delay-200',
                },
                {
                  title: 'Double-Sorted Grade',
                  body: 'Strictly hand-graded and double-sorted. We select only the largest, fluffiest, and most uniform seeds.',
                  delay: 'delay-300',
                },
              ].map((card) => (
                <div
                  key={card.title}
                  className={`bg-[#122313] p-8 rounded-2xl border border-[#c89030]/10 hover:border-[#c89030]/30 transition-all duration-300 stagger-card ${card.delay} group`}
                >
                  <div className="w-8 h-0.5 bg-[#c89030] rounded-full mb-5 group-hover:w-12 transition-all duration-300"></div>
                  <h3 className="text-[#f0ead6] font-semibold text-[16px] mb-3">{card.title}</h3>
                  <p className="text-[#a8c098] text-[14px] leading-relaxed">{card.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── BENEFITS / PRODUCT PREVIEW ── */}
        <section
          id="benefits"
          className="w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-16 md:py-28 flex flex-col md:flex-row-reverse items-center gap-12"
        >
          <div className="flex-1 flex flex-col items-start justify-center pl-0 md:pl-12 reveal-section">
            <span className="text-[#c89030] text-[11px] font-bold uppercase tracking-[0.2em] mb-4 block">Snack Smart</span>
            <h2 className="font-headline text-[30px] md:text-[40px] text-[#f0ead6] mb-6 leading-tight">
              Naturally<br />Nutrient-Dense
            </h2>
            <p className="text-[#a8c098] mb-8 leading-relaxed text-[16px]">
              Bharat Harvest lotus seeds are gluten-free, low-sodium, high-protein, and packed with antioxidants — making them the perfect mindful snack.
            </p>

            {/* Benefit Pills */}
            <div className="flex flex-wrap gap-2 mb-8">
              {['High Protein', 'Gluten Free', 'Low Calorie', 'Antioxidant Rich', '100% Vegan'].map((tag) => (
                <span key={tag} className="px-3.5 py-1.5 rounded-full text-[12px] font-semibold bg-[#c89030]/12 text-[#c89030] border border-[#c89030]/25">
                  {tag}
                </span>
              ))}
            </div>

            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-[#c89030] font-semibold text-[15px] border-b border-[#c89030]/40 pb-0.5 hover:text-[#e8b848] hover:border-[#e8b848] transition-colors duration-300"
            >
              Explore Flavours
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
          </div>

          <div className="flex-1 w-full h-[320px] md:h-[440px] rounded-2xl overflow-hidden border border-[#c89030]/20 shadow-[0_24px_60px_rgba(0,0,0,0.5)] reveal-section delay-200">
            <img
              className="w-full h-full object-cover"
              alt="Makhana served in organic clay bowls"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBQrSF9BFonQ5y4dsYxT525diXphx25af24pIUCDmkCPUWAoTgwkxuz945tJsIBJ7QVky-AzMjOBxrjx0GcmrAudi3xU_eNu2N4d-KVnbFCUOs_1aUj9nRnKDbPhcEDa2Q02mR7w9pPqz-12QpCb4zbJRnHhGpgeFThtKVHqiQIwwAuyHgV8BKyZ26oJz_oILjcECtxnd1GZ_9tWi5Y0ip_opwn0e6Rwx0GGYh1I9A54ZiyEV8hZBLYfD-y3rcBxiuD3Sxw2ZT9OPEz"
            />
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
