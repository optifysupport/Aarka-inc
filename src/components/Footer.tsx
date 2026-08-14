import React from 'react';
import logo from '../../assets/logo.png';

interface FooterProps {
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  return (
    <footer className="glass-nav w-full border-t border-[#e5beb3]/40 mt-12 bg-[#fff1ed]">
      <div className="flex flex-col md:flex-row justify-between items-start px-6 md:px-16 py-12 gap-8 max-w-[1440px] mx-auto w-full">
        {/* Brand Summary */}
        <div className="flex flex-col gap-2 max-w-xs">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Aarka Inc" className="h-10 w-auto" />
            <span className="font-extrabold text-2xl text-[#271813] tracking-tighter">
              Aarka Inc
            </span>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed">
            Engineering clarity. Augmenting performance. Precision engineered components, high-speed fans, modern lighting, and industrial peripherals.
          </p>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col gap-2">
          <h4 className="font-bold text-xs text-[#271813] uppercase tracking-wider mb-1">
            Contact Us
          </h4>
          <div className="flex flex-col gap-2 text-sm text-gray-700 max-w-xs">
            <p className="leading-relaxed">
              Columbia hospital back side, 5, Maruthi nagar, Bashettihalli, Karnataka 562163
            </p>
            <a
              href="tel:9844318555"
              className="flex items-center gap-1.5 text-[#271813] hover:text-[#ab2f00] transition-colors font-medium"
            >
              <span className="material-symbols-outlined text-[18px] text-[#ab2f00]">call</span>
              98443 18555
            </a>
            <a
              href="tel:9066558866"
              className="flex items-center gap-1.5 text-[#271813] hover:text-[#ab2f00] transition-colors font-medium"
            >
              <span className="material-symbols-outlined text-[18px] text-[#ab2f00]">call</span>
              90665 58866
            </a>
            <a
              href="https://wa.me/919844318555"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[#271813] hover:text-[#ab2f00] transition-colors font-medium"
            >
              <svg className="w-5 h-5 text-[#ab2f00] fill-current" viewBox="0 0 24 24">
                <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984 0 1.758.459 3.474 1.33 4.982l-1.413 5.161 5.283-1.386a9.937 9.937 0 004.788 1.233h.004c5.506 0 9.99-4.478 9.99-9.985 0-2.667-1.037-5.176-2.922-7.062A9.923 9.923 0 0012.012 2zm.004 18.256h-.003a8.272 8.272 0 01-4.22-1.157l-.303-.18-3.136.822.836-3.057-.197-.314a8.28 8.28 0 01-1.268-4.385c0-4.567 3.717-8.284 8.287-8.284 2.213 0 4.293.863 5.858 2.429a8.232 8.232 0 012.426 5.856c0 4.568-3.717 8.285-8.28 8.285zm4.538-6.195c-.249-.125-1.473-.727-1.702-.81-.228-.083-.395-.125-.561.125-.166.249-.644.81-.79 1.002-.145.187-.291.208-.54.083-.249-.125-1.052-.388-2.003-1.236-.74-.66-1.24-1.475-1.385-1.724-.145-.249-.015-.384.11-.508.112-.112.249-.291.374-.436.125-.145.166-.249.249-.415.083-.166.042-.312-.021-.436-.062-.125-.561-1.349-.769-1.849-.202-.488-.408-.422-.561-.43l-.478-.01c-.166 0-.436.062-.664.312-.228.249-.872.852-.872 2.078 0 1.226.893 2.409 1.018 2.575.125.166 1.758 2.685 4.258 3.765.595.257 1.06.411 1.423.527.597.19 1.14.163 1.569.099.479-.071 1.473-.602 1.68-1.183.208-.582.208-1.08.145-1.183-.062-.104-.228-.166-.477-.291z" />
              </svg>
              WhatsApp Us
            </a>
            <a
              href="mailto:aarkainc7@gmail.com"
              className="flex items-center gap-1.5 text-[#271813] hover:text-[#ab2f00] transition-colors font-medium"
            >
              <span className="material-symbols-outlined text-[18px] text-[#ab2f00]">mail</span>
              aarkainc7@gmail.com
            </a>
          </div>
        </div>

        {/* Map */}
        <div className="w-full md:w-80">
          <h4 className="font-bold text-xs text-[#271813] uppercase tracking-wider mb-3">
            Location
          </h4>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4839.2328702376535!2d77.54742211011563!3d13.26998618768865!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bb1dfe6be723b41%3A0x701f7a430e9cabf1!2sAARKA%20INC!5e0!3m2!1sen!2sin!4v1785935831247!5m2!1sen!2sin"
            width="100%"
            height="200"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            className="rounded-lg shadow-sm"
            title="Aarka Inc Location"
          ></iframe>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-[#e5beb3]/30 px-6 md:px-16 py-4 max-w-[1440px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
        <p className="text-xs text-gray-500">
          © 2026 Aarka Inc Industrial Electrical Suppliers. All rights reserved.
        </p>
        <div className="flex items-center gap-4 text-xs text-gray-500">
          {/* Privacy Policy secretly triggers Admin Panel Login */}
          <button
            type="button"
            onClick={onOpenAdmin}
            className="hover:text-[#ab2f00] transition-colors cursor-pointer"
          >
            Privacy Policy
          </button>
          <a href="#about-us" className="hover:text-[#ab2f00] transition-colors">
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  );
};
