import React from 'react';

// Example Social Media Icons (replace with actual SVGs or an icon library if preferred)
const FacebookIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
  </svg>
);

const TwitterIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
  </svg>
);

const InstagramIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C8.74 2 8.333.015 6.983.003 5.633 0 4.94.144 4.172.45A4.88 4.88 0 002.45 2.45c-.305.77-.447 1.46-.45 2.81C2.002 6.67 2 7.26 2 12s.002 5.33.003 6.718c.003 1.35.145 2.04.45 2.81.305.77.963 1.428 1.722 1.722.77.305 1.46.447 2.81.45 1.45.002 1.753.003 5.017.003s3.567-.001 5.017-.003c1.35-.003 2.04-.145 2.81-.45.77-.305 1.428-.963 1.722-1.722.305-.77.447-1.46.45-2.81.002-1.45.003-1.753.003-5.017s-.001-3.567-.003-5.017c-.003-1.35-.145-2.04-.45-2.81a4.88 4.88 0 00-1.722-1.722c-.77-.305-1.46-.447-2.81-.45C15.667 2.002 15.26 2 12 2zm0 1.622c3.186 0 3.53.012 4.79.07 1.175.053 1.845.248 2.228.39.49.188.878.417 1.26.8.384.383.614.77.802 1.26.142.383.337 1.053.39 2.228.058 1.26.07 1.604.07 4.79s-.012 3.53-.07 4.79c-.053 1.175-.248 1.845-.39 2.228-.188.49-.418.878-.802 1.26-.382.384-.77.614-1.26.802-.383.142-1.053.337-2.228.39-1.26.058-1.604.07-4.79.07s-3.53-.012-4.79-.07c-1.175-.053-1.845-.248-2.228-.39-.49-.188-.878-.418-1.26-.802-.384-.382-.614-.77-.802-1.26-.142-.383-.337-1.053-.39-2.228-.058-1.26-.07-1.604-.07-4.79s.012-3.53.07-4.79c.053-1.175.248-1.845.39-2.228.188-.49.418-.878.802-1.26.382-.384.77-.614 1.26-.802.383-.142 1.053-.337 2.228-.39C8.47 3.633 8.814 3.622 12 3.622zm0 2.71a5.668 5.668 0 100 11.336 5.668 5.668 0 000-11.336zm0 9.353a3.684 3.684 0 110-7.368 3.684 3.684 0 010 7.368zm6.404-9.56a1.375 1.375 0 100-2.75 1.375 1.375 0 000 2.75z" />
  </svg>
);

const socialLinks = [
  { name: 'Facebook', href: 'https://facebook.com/yourpage', icon: FacebookIcon },
  { name: 'Twitter', href: 'https://twitter.com/yourprofile', icon: TwitterIcon },
  { name: 'Instagram', href: 'https://instagram.com/yourprofile', icon: InstagramIcon },
  // Add more social links here
];

const Footer = () => {
  return (
    <footer className="bg-mygreen-dark text-white pt-12 pb-8 px-4 sm:px-6 lg:px-8 dark:bg-env-gray-darker">
      <div className="container mx-auto text-center">
        <div className="mb-6">
          <p className="text-lg font-semibold">Environment Direct</p>
          <p className="text-sm text-mygreen-lighter opacity-90 mt-1">
            Leading the way in environmental solutions and awareness in Dominica.
          </p>
        </div>

        <div className="flex justify-center space-x-6 mb-8">
          {socialLinks.map((item) => (
            <a 
              key={item.name} 
              href={item.href} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-mygreen-lighter hover:text-white transition-colors duration-300"
              aria-label={item.name}
            >
              <item.icon className="w-7 h-7" />
            </a>
          ))}
        </div>

        <p className="text-sm text-mygreen-lighter opacity-80">
          &copy; {new Date().getFullYear()} Environment Direct. All rights reserved.
        </p>
        <p className="text-xs text-mygreen-lighter opacity-60 mt-1">
          Powered by Nature, Driven by Data.
        </p>
      </div>
    </footer>
  );
};

export default Footer; 