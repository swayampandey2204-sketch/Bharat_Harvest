import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function JournalPage() {
  return (
    <div className="bg-[#0c1e0e] text-[#f0ead6] min-h-screen flex flex-col antialiased">
      <Navbar />

      <main className="flex-grow max-w-4xl mx-auto px-margin-mobile md:px-margin-desktop py-16 md:py-24">
        {/* Article Header */}
        <article className="space-y-12">
          <header className="text-center space-y-6">
            <span className="text-[#c89030] text-[11px] font-bold uppercase tracking-[0.2em] block">The Journal</span>
            <h1 className="font-headline text-[38px] md:text-[54px] leading-tight text-[#f0ead6] max-w-3xl mx-auto">
              Rooted in Purity.<br />
              <span className="italic text-[#c89030]">Inspired by Tradition.</span>
            </h1>
            <div className="flex items-center justify-center gap-3 text-[13px] text-[#4a704a]">
              <span>Published by Bharat Harvest Organic</span>
              <span>&bull;</span>
              <span>Mindful Snacking</span>
            </div>
            <div className="w-16 h-px bg-[#c89030]/30 mx-auto mt-6"></div>
          </header>

          {/* Article Banner image */}
          <div className="w-full aspect-[16/9] rounded-3xl overflow-hidden relative border border-[#c89030]/15 shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
            <img
              className="w-full h-full object-cover"
              alt="Golden organic harvest in a rural village."
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDux3RXgRvz3AdiL7wpiwDSv6NL2wwqRELo2TUBFonTSvaP8urex3rXCeO51sipED3BHPN6gFBE9rWT2FLFgdj7Zo0NY598aaS9HL5j8qwdUHthDEr99Oy9lnCZAGnExqXcVPLNrFIlD2VjHQt30xPZaivdY7P4t6jb7BhJiTaYvehf1WGKxyZBdyRmOJMd372S8QURm1CvjYnmGOnvvbJbqpPpyrBgJQHDAOY3TVh6F51BtCqPWQqXmbPhPQdv00fNQexRcjq3q7B8"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0c1e0e]/40 to-transparent"></div>
          </div>

          {/* Article Body */}
          <div className="space-y-8 text-[16px] md:text-[18px] leading-relaxed text-[#a8c098] font-sans">
            <p className="first-letter:text-5xl first-letter:font-headline first-letter:text-[#c89030] first-letter:float-left first-letter:mr-3 first-letter:mt-1">
              In a world that is constantly moving, true wellness lies in returning to what is pure, authentic, and timeless. At Bharat Harvest Organic, we believe that the finest nourishment comes from nature itself—grown with care, harvested with patience, and shared with purpose.
            </p>

            <p>
              Founded in 2026, Bharat Harvest Organic was born from a simple vision: to bring the extraordinary goodness of Bihar's treasured superfood, Makhana, to modern consumers seeking a healthier and more mindful way of living.
            </p>

            {/* Section 1 */}
            <h2 className="font-headline text-[26px] md:text-[32px] text-[#f0ead6] pt-6 border-b border-[#c89030]/10 pb-2">
              The Sacred Waters of Bihar
            </h2>
            <p>
              Our story begins in the serene wetlands of Bihar, the global heartland of Makhana cultivation. For centuries, these sacred waters have nurtured one of India's most cherished superfoods—a crop deeply woven into the region's culture, traditions, and way of life.
            </p>
            <p>
              Here, generations of farming families have perfected the art of cultivating Makhana with dedication and respect for nature. Every seed carries the legacy of this remarkable land and the wisdom of those who have cared for it for centuries.
            </p>
            <p>
              At Bharat Harvest Organic, we proudly honor this heritage by sourcing our Makhanas from the finest farms of Bihar, ensuring that every harvest reflects the purity and authenticity of its origin.
            </p>

            {/* Section 2 */}
            <h2 className="font-headline text-[26px] md:text-[32px] text-[#f0ead6] pt-6 border-b border-[#c89030]/10 pb-2">
              Crafted by Nature, Perfected with Care
            </h2>
            <p>
              Each Makhana is carefully hand-harvested and gently popped to preserve its natural goodness, delicate crunch, and exceptional nutritional value.
            </p>
            <p>
              Rich in plant-based protein, naturally gluten-free, and packed with essential nutrients, our Makhanas are thoughtfully crafted for those who believe that healthy living should never compromise on taste or quality.
            </p>
            <p className="border-l-2 border-[#c89030] pl-6 py-1 text-[#f0ead6] italic text-[18px] md:text-[20px] font-headline my-8">
              "Every handful is a celebration of nature's simplicity—clean ingredients, mindful processes, and uncompromising standards."
            </p>

            {/* Section 3 */}
            <h2 className="font-headline text-[26px] md:text-[32px] text-[#f0ead6] pt-6 border-b border-[#c89030]/10 pb-2">
              A New Age of Mindful Snacking
            </h2>
            <p>
              We live in an era where people seek more from the food they consume. They seek transparency, authenticity, and nourishment that aligns with their values.
            </p>
            <p>
              Bharat Harvest Organic was created for this new generation of conscious consumers—individuals who appreciate the balance between tradition and modern living, indulgence and wellness, simplicity and sophistication.
            </p>
            <p>
              Our products are designed to fit seamlessly into everyday life, whether enjoyed during a busy workday, after a workout, on a family gathering, or in moments of quiet reflection.
            </p>

            {/* Section 4 - Core Commitments */}
            <h2 className="font-headline text-[26px] md:text-[32px] text-[#f0ead6] pt-8 pb-4 text-center">
              Our Commitments
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {[
                { title: 'Purity', desc: 'We believe in preserving the natural integrity of every ingredient and delivering products that are as wholesome as nature intended.' },
                { title: 'Heritage', desc: "We celebrate Bihar's rich agricultural legacy and proudly share its treasured superfood with the world." },
                { title: 'Sustainability', desc: 'We are committed to supporting local farming communities and encouraging practices that respect both people and the planet.' },
                { title: 'Excellence', desc: 'From sourcing to packaging, every detail is guided by our unwavering commitment to quality and craftsmanship.' }
              ].map((val) => (
                <div key={val.title} className="bg-[#122313] border border-[#c89030]/15 p-6 rounded-2xl">
                  <h3 className="text-[#c89030] font-bold text-[16px] mb-2 uppercase tracking-wide">{val.title}</h3>
                  <p className="text-[14px] text-[#a8c098] leading-relaxed">{val.desc}</p>
                </div>
              ))}
            </div>

            {/* Section 5 - More Than a Snack */}
            <h2 className="font-headline text-[26px] md:text-[32px] text-[#f0ead6] pt-8 border-b border-[#c89030]/10 pb-2">
              More Than a Snack
            </h2>
            <p>
              Bharat Harvest Organic is more than a brand—it is a tribute to the land, the farmers, and the traditions that have made Makhana one of India's most remarkable superfoods.
            </p>
            
            <div className="bg-[#122313] p-8 rounded-3xl border border-[#c89030]/20 space-y-4 my-8 text-center">
              <p className="text-[#f0ead6] font-semibold text-[17px]">When you choose us, you are choosing:</p>
              <div className="space-y-2 text-[#c89030] font-headline text-[20px] italic">
                <p>&ldquo;Authenticity over excess&rdquo;</p>
                <p>&ldquo;Nourishment rooted in nature&rdquo;</p>
                <p>&ldquo;Timeless wisdom of Bihar's sacred waters&rdquo;</p>
              </div>
            </div>

            {/* Section 6 - Our Promise */}
            <h2 className="font-headline text-[26px] md:text-[32px] text-[#f0ead6] pt-6 border-b border-[#c89030]/10 pb-2">
              Our Promise
            </h2>
            <p>
              To bring you the purest expression of Bihar's finest harvest—crafted with integrity, inspired by tradition, and made for mindful living.
            </p>

            <div className="text-center pt-12 pb-6 space-y-4">
              <h3 className="font-headline text-[24px] text-[#c89030]">Bharat Harvest Organic</h3>
              <p className="text-[#a8c098] text-[14px] italic mb-6">A Handful of Health. A Heart Full of Tradition. 🌿✨</p>
              <div className="pt-4">
                <Link
                  href="/about"
                  className="inline-block bg-transparent border border-[#c89030]/40 text-[#c89030] hover:text-[#0c1e0e] hover:bg-[#c89030] px-8 py-3.5 rounded-full font-semibold text-[14px] transition-all duration-300 shadow-[0_4px_12px_rgba(200,144,48,0.15)] active:scale-98 cursor-pointer"
                >
                  Exit Full Journal
                </Link>
              </div>
            </div>

          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
