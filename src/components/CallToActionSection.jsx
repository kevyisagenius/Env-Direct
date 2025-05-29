import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const CallToActionSection = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const button1Ref = useRef(null);
  const button2Ref = useRef(null);

  useEffect(() => {
    const sectionEl = sectionRef.current;
    const titleEl = titleRef.current;
    const button1El = button1Ref.current;
    const button2El = button2Ref.current;

    // Set initial states for animation (invisible and slightly offset)
    gsap.set([titleEl, button1El, button2El], { autoAlpha: 0, y: 30 });

    // Timeline for sequenced animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionEl,
        start: "top 80%", // Start animation when section top is 80% in view
        toggleActions: "play none none none", // Play once
      },
      defaults: { ease: "power3.out" }
    });

    tl.to(titleEl, { autoAlpha: 1, y: 0, duration: 0.8 })
      .to([button1El, button2El], { autoAlpha: 1, y: 0, stagger: 0.2, duration: 0.6 }, "-=0.5"); // Stagger buttons

  }, []);

  return (
    <section ref={sectionRef} className="py-16 md:py-24 bg-mygreen dark:bg-mygreen-dark">
      <div className="container mx-auto px-4 text-center">
        <div ref={titleRef} className="mb-10 opacity-0 transform translate-y-[30px]">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Make a Difference?
          </h2>
          <p className="text-white opacity-90 max-w-xl mx-auto">
            Contribute to a healthier planet by submitting environmental observations or explore real-time data on our interactive map.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 md:gap-6">
          <Link
            ref={button1Ref}
            to="/submit-report" // Make sure this route exists
            className="inline-block bg-white hover:bg-gray-200 text-mygreen-dark font-semibold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-lg transform hover:scale-105 opacity-0 translate-y-[30px]"
          >
            Submit a Report
          </Link>
          <Link
            ref={button2Ref}
            to="/map" // Make sure this route exists
            className="inline-block bg-mygreen-light hover:bg-mygreen text-mygreen-dark dark:bg-mygreen-lighter dark:hover:bg-mygreen dark:text-mygreen-dark font-semibold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-lg transform hover:scale-105 opacity-0 translate-y-[30px]"
          >
            Explore Live Map
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CallToActionSection; 