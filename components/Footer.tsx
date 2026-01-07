import React from 'react';

interface FooterProps {
  termsText?: string;
  copyrightText?: string;
}

const Footer: React.FC<FooterProps> = ({
  termsText = "Terms of Use",
  copyrightText = "© 2025 Sharaf SYSTEMS. ALL RIGHTS RESERVED",
}) => {
  return (
    <footer className="w-full bg-black/90 backdrop-blur-[20px] text-gray-400 text-[10px] md:text-xs py-12 border-t border-white/10 text-center relative z-20">
      <div className="max-w-6xl mx-auto px-4">
        <p className="mb-2">{termsText}</p>
        <p>{copyrightText}</p>
      </div>
    </footer>
  );
};

export default Footer;
