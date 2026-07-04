import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="bg-[#0c1e0e] text-[#f0ead6] min-h-screen flex flex-col antialiased">
      <Navbar />

      <main className="flex-grow">

        {/* Hero */}
        <section className="relative w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-16 md:py-24 flex flex-col items-center text-center">
          <span className="text-[#c89030] text-[11px] font-bold uppercase tracking-[0.2em] mb-5 block">Our Heritage</span>
          <h1 className="font-headline text-[34px] md:text-[52px] leading-tight text-[#f0ead6] mb-8 max-w-3xl">
            From the Pond to your Plate
          </h1>
          <p className="text-[17px] text-[#a8c098] max-w-2xl mb-12 leading-relaxed">
            Discover the rich heritage and natural beauty behind every handful of Bharat Harvest's premium fox nuts. Rooted in tradition, harvested with care.
          </p>
          <div className="w-full aspect-[16/9] md:aspect-[21/9] rounded-2xl overflow-hidden relative border border-[#c89030]/20 shadow-[0_24px_60px_rgba(0,0,0,0.5)]">
            <img
              className="w-full h-full object-cover"
              alt="Lotus pond at golden hour in rural India."
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDux3RXgRvz3AdiL7wpiwDSv6NL2wwqRELo2TUBFonTSvaP8urex3rXCeO51sipED3BHPN6gFBE9rWT2FLFgdj7Zo0NY598aaS9HL5j8qwdUHthDEr99Oy9lnCZAGnExqXcVPLNrFIlD2VjHQt30xPZaivdY7P4t6jb7BhJiTaYvehf1WGKxyZBdyRmOJMd372S8QURm1CvjYnmGOnvvbJbqpPpyrBgJQHDAOY3TVh6F51BtCqPWQqXmbPhPQdv00fNQexRcjq3q7B8"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0c1e0e]/60 via-transparent to-transparent pointer-events-none"></div>
          </div>
        </section>

        {/* Sourcing Heritage */}
        <section className="w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
            <div className="md:col-span-5 flex flex-col space-y-5 order-2 md:order-1 mt-8 md:mt-0">
              <span className="text-[#c89030] text-[11px] font-bold uppercase tracking-[0.2em]">The Process</span>
              <h2 className="font-headline text-[30px] md:text-[38px] text-[#f0ead6] leading-tight">
                Our Sourcing Heritage
              </h2>
              <p className="text-[15px] text-[#a8c098] leading-relaxed">
                The journey of the lotus seed is one of patience and profound connection to the earth. For generations, farming families have cultivated these aquatic seeds in the mineral-rich waters of Bihar.
              </p>
              <p className="text-[15px] text-[#a8c098] leading-relaxed">
                We honor this painstaking, traditional process. Every seed is gathered from the muddy pond floor, washed, sun-dried, roasted over wood fire, and popped to reveal the pristine, white puff inside.
              </p>
              <div className="pt-2">
                <Link
                  href="/journal"
                  className="inline-block bg-[#c89030] text-[#0c1e0e] px-8 py-3 rounded-full font-semibold text-[14px] hover:bg-[#e8b848] active:scale-98 transition-all shadow-[0_6px_20px_rgba(200,144,48,0.3)] cursor-pointer"
                >
                  Read the Full Journal
                </Link>
              </div>
            </div>

            <div className="md:col-span-7 grid grid-cols-2 gap-4 order-1 md:order-2">
              <div className="col-span-2 md:col-span-1 rounded-2xl overflow-hidden h-[280px] md:h-[420px] border border-[#c89030]/15 shadow-[0_12px_40px_rgba(0,0,0,0.4)]">
                <img
                  className="w-full h-full object-cover"
                  alt="Hands holding freshly harvested black fox nut seeds."
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDbDdiN5_v-Q_gMrVEto6D9VPS6JtauE66OnKKbPt6V1VxF3EbuBIFybGoxpSI2xJMZAqgXmL-TAgM8GB57lfuKXYrJzD0bIfLkyYfZYVJeWUrA-znBuZk-ihH77oyzQNxGqnrgJsdaKvBGIksm1j-bR2ExBR7UinuN15isSZ5AyEy2zr-ymlU7lEHRGRXBWNSNJBEL6uf43lV6d7wX_ELQxv2X5_sxwrn54uQzWuzAdm4ddpjmVkjJNKL0j8gMWRFXzZxL0ZkBUBKO"
                />
              </div>
              <div className="col-span-2 md:col-span-1 flex flex-col gap-4">
                <div className="rounded-2xl overflow-hidden flex-1 border border-[#c89030]/15 shadow-[0_8px_24px_rgba(0,0,0,0.3)]">
                  <img
                    className="w-full h-full object-cover"
                    alt="Fox nuts drying on a mat in the sun."
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDxorn0m66iMLCv-AG0yQLoBqsfUlaVP2cIgPPdXcySyYW1ih8PkVT6mN6f2xQS9jmiWCJ-6KyXKcd1ab36GAoub5AVPUNs8VqJP4kax1iaBMhv24oBT0Cr2u0yQHRiMYRToAoN3VCsBbYhR1QI6L5iPnJr5F3F_VAWn_bCuzDO95zSVuObIlMnAvuugjD1BuBoAcDw3R8KEjyewjN-5_ZbACQFkv0-z0E-A3IHvavCP3_NYYAg0gscICZYDDZ8pE1yaYmMGrKS-39G"
                  />
                </div>
                <div className="bg-[#122313] p-6 rounded-2xl flex flex-col justify-center border border-[#c89030]/15">
                  <span className="material-symbols-outlined text-[#c89030] mb-3 text-[24px]">local_fire_department</span>
                  <h3 className="font-semibold text-[15px] text-[#f0ead6] mb-1.5">Wood-Fired Roasting</h3>
                  <p className="text-[13px] text-[#a8c098] leading-relaxed">
                    Traditionally roasted in earthen clay pots over slow-burning wood fires.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="w-full bg-[#0e2010] py-16 md:py-20 border-t border-[#c89030]/10">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
            <div className="text-center mb-14">
              <span className="text-[#c89030] text-[11px] font-bold uppercase tracking-[0.2em] mb-3 block">Our Principles</span>
              <h2 className="font-headline text-[30px] md:text-[38px] text-[#f0ead6] mb-4">Rooted in Trust</h2>
              <p className="text-[16px] text-[#a8c098] max-w-2xl mx-auto leading-relaxed">
                We believe that truly nourishing food comes from transparency, respect for the land, and an unwavering commitment to quality.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: '100% Natural',
                  body: 'No artificial flavors, preservatives, or hidden additives. Just the pure, earthy goodness of the lotus seed.',
                },
                {
                  title: 'Gold Grade Sourcing',
                  body: 'We meticulously sort our harvest, selecting only the largest, fluffiest, and most perfectly popped nuts.',
                },
                {
                  title: 'Direct Trade',
                  body: 'We partner directly with farming cooperatives, ensuring fair wages and supporting local agricultural communities.',
                },
              ].map((card) => (
                <div
                  key={card.title}
                  className="bg-[#122313] rounded-2xl p-8 border border-[#c89030]/10 hover:border-[#c89030]/30 transition-all duration-300 group"
                >
                  <div className="w-8 h-0.5 bg-[#c89030] rounded-full mb-5 group-hover:w-14 transition-all duration-300"></div>
                  <h3 className="text-[#f0ead6] font-semibold text-[16px] mb-3">{card.title}</h3>
                  <p className="text-[14px] text-[#a8c098] leading-relaxed">{card.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
