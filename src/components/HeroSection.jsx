import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';

const HeroSection = () => {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const taglineRef = useRef(null);
  const button1Ref = useRef(null);
  const button2Ref = useRef(null);

  useEffect(() => {
    const sectionEl = sectionRef.current;
    const headingEl = headingRef.current;
    const taglineEl = taglineRef.current;
    const button1El = button1Ref.current;
    const button2El = button2Ref.current;

    gsap.set([headingEl, taglineEl, button1El, button2El], { autoAlpha: 0 }); // Start invisible

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.to(headingEl, { autoAlpha: 1, y: 0, duration: 0.8, delay: 0.3 })
      .to(taglineEl, { autoAlpha: 1, y: 0, duration: 0.7 }, "-=0.5") // Overlap slightly
      .to([button1El, button2El], { autoAlpha: 1, y: 0, stagger: 0.2, duration: 0.6 }, "-=0.4"); // Stagger buttons

  }, []);

  return (
    <section
      ref={sectionRef}
      className="h-screen flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 overflow-hidden bg-mygreen-light dark:bg-gradient-to-br dark:from-green-900 dark:to-teal-800"
    >
      <div className="max-w-3xl mx-auto">
        <h1 ref={headingRef} className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-mygreen-dark dark:text-gray-200 leading-tight mb-6 opacity-0 transform translate-y-10">
          Environment <span className="text-white dark:text-mygreen-light">Direct</span>
        </h1>
        <p ref={taglineRef} className="mt-4 text-lg sm:text-xl md:text-2xl text-mygreen-dark dark:text-gray-300 opacity-90 mb-10 opacity-0 transform translate-y-10">
          Your trusted source for real-time environmental insights and community action in Dominica.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <Link
            ref={button1Ref}
            to="/dashboard"
            className="inline-block bg-mygreen-dark hover:bg-mygreen text-white dark:bg-mygreen dark:hover:bg-mygreen-light dark:text-white dark:hover:text-mygreen-dark font-semibold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-lg transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-mygreen focus:ring-opacity-50 opacity-0 translate-y-10"
          >
            Explore Live Data
          </Link>
          <Link
            ref={button2Ref}
            to="/get-involved"
            className="inline-block bg-transparent hover:bg-mygreen-dark/10 text-mygreen-dark dark:text-mygreen-light dark:hover:bg-mygreen-light/20 border-2 border-mygreen-dark dark:border-mygreen-light font-semibold py-3 px-8 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 text-lg transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-mygreen-light focus:ring-opacity-50 opacity-0 translate-y-10"
          >
            Get Involved
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection; 