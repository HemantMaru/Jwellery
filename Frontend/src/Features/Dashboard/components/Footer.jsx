import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#111111] text-white pt-20 pb-10 font-['Poppins']">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div>
            <h1 className="font-['Playfair_Display'] text-3xl font-bold tracking-wider mb-6">
              AURUM
            </h1>
            <p className="text-gray-400 font-light text-sm leading-loose">
              Crafting timeless elegance and modern luxury since 1992. Designed
              for the sophisticated soul.
            </p>
          </div>
          <div>
            <h4 className="font-['Playfair_Display'] text-lg mb-6 text-[#C9A14A]">
              Quick Links
            </h4>
            <ul className="space-y-4 text-sm font-light text-gray-400">
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  Our Story
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-white transition-colors">
                  Collections
                </Link>
              </li>
              <li>
                <Link to="/favorites" className="hover:text-white transition-colors">
                  Favorites
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-['Playfair_Display'] text-lg mb-6 text-[#C9A14A]">
              Customer Care
            </h4>
            <ul className="space-y-4 text-sm font-light text-gray-400">
              <li>
                <Link to="/products" className="hover:text-white transition-colors">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-white transition-colors">
                  Jewellery Care
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-white transition-colors">
                  Ring Size Guide
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  FAQs
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-['Playfair_Display'] text-lg mb-6 text-[#C9A14A]">
              Contact
            </h4>
            <ul className="space-y-4 text-sm font-light text-gray-400">
              <li>5th Avenue, New York, NY 10001</li>
              <li>contact@aurumjewels.com</li>
              <li>+1 (800) 123-4567</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 font-light">
          <p>
            &copy; {new Date().getFullYear()} Aurum Jewellery. All rights
            reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="https://www.instagram.com" target="_blank" rel="noreferrer" className="hover:text-white">
              Instagram
            </a>
            <a href="https://www.facebook.com" target="_blank" rel="noreferrer" className="hover:text-white">
              Facebook
            </a>
            <a href="https://www.pinterest.com" target="_blank" rel="noreferrer" className="hover:text-white">
              Pinterest
            </a>
          </div>
        </div>

        <div className="pt-10 text-center">
          <a 
            href="#" 
            target="_blank" 
            rel="noreferrer" 
            className="text-[10px] uppercase tracking-[0.25em] text-white/30 hover:text-[#C9A14A] hover:opacity-100 transition-all duration-500 font-light"
          >
            Designed & Developed by Hemant Maru
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
