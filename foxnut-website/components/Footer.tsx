import Link from 'next/link';

export default function Footer() {
  return (
    <footer id="footer" className="w-full bg-[#071308] border-t border-[#c89030]/20 mt-section-gap">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 px-margin-mobile md:px-margin-desktop pt-16 pb-12 max-w-container-max mx-auto">
        
        {/* Brand Column */}
        <div className="flex flex-col space-y-5">
          <Link
            href="/"
            className="font-headline text-[26px] text-[#c89030] hover:text-[#e8b848] transition-colors duration-200 block"
          >
            Bharat Harvest
          </Link>
          <p className="text-[14px] leading-relaxed text-[#a8c098] max-w-xs">
            Popping premium Gold Grade fox nuts with integrity. Crafted for the health-conscious snacker seeking clean, wood-fired nourishment.
          </p>
          
          {/* Social Icons */}
          <div className="flex items-center space-x-4 pt-2">
            {/* Instagram */}
            <a
              href="https://www.instagram.com/thebharatharvest?igsh=MXdxNnVrNHM1dTZrMA=="
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="w-9 h-9 rounded-full bg-[#122313] border border-[#c89030]/20 flex items-center justify-center text-[#c89030] hover:text-[#e8b848] hover:border-[#c89030] hover:bg-[#c89030]/10 transition-all duration-300"
            >
              <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
              </svg>
            </a>
            {/* Facebook */}
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="w-9 h-9 rounded-full bg-[#122313] border border-[#c89030]/20 flex items-center justify-center text-[#c89030] hover:text-[#e8b848] hover:border-[#c89030] hover:bg-[#c89030]/10 transition-all duration-300"
            >
              <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Customer Policies */}
        <div className="flex flex-col space-y-4">
          <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#c89030] mb-1">Customer Policies</h4>
          <ul className="flex flex-col space-y-2.5">
            {[
              { label: 'Privacy Policy', href: '/privacy-policy' },
              { label: 'Return & Refund Policy', href: '/refund-policy' },
              { label: 'Shipping Policy', href: '/shipping-policy' },
              { label: 'Disclaimer', href: '/disclaimer' },
              { label: 'Terms & Conditions', href: '/terms-and-conditions' },
            ].map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-[14px] text-[#a8c098] hover:text-[#e8b848] transition-colors duration-200"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick Explorer */}
        <div className="flex flex-col space-y-4">
          <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#c89030] mb-1">Explore</h4>
          <ul className="flex flex-col space-y-2.5">
            {[
              { label: 'Products Catalog', href: '/shop' },
              { label: 'About Our Heritage', href: '/about' },
              { label: 'Health Benefits', href: '/#benefits' },
            ].map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-[14px] text-[#a8c098] hover:text-[#e8b848] transition-colors duration-200"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info Column */}
        <div className="flex flex-col space-y-4">
          <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#c89030] mb-1">Contact Us</h4>
          <ul className="flex flex-col space-y-3.5 text-[14px] text-[#a8c098]">
            <li className="flex items-start gap-2.5">
              <span className="material-symbols-outlined text-[18px] text-[#c89030] shrink-0 mt-0.5">mail</span>
              <a href="mailto:admin@thebharatharvest.com" className="hover:text-[#e8b848] transition-colors break-all">
                admin@thebharatharvest.com
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="material-symbols-outlined text-[18px] text-[#c89030] shrink-0 mt-0.5">call</span>
              <a href="tel:+917061461679" className="hover:text-[#e8b848] transition-colors">
                +91 7061461679
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="material-symbols-outlined text-[18px] text-[#c89030] shrink-0 mt-0.5">location_on</span>
              <span>Patna (Bihar), Delhi, Mumbai, India</span>
            </li>
          </ul>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="px-margin-mobile md:px-margin-desktop pb-8 max-w-container-max mx-auto border-t border-[#c89030]/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
        <p className="text-[12px] text-[#4a704a]">
          &copy; {new Date().getFullYear()} Bharat Harvest. All rights reserved.
        </p>
        <p className="text-[12px] text-[#4a704a]">
          Premium Grade Makhana.
        </p>
      </div>
    </footer>
  );
}

