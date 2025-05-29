import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Placeholder icons (you can replace these with actual SVGs or an icon library)
const PlaceholderIcon = ({ className = "w-12 h-12 text-mygreen mb-4" }) => (
  <svg className={className} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
    <path d="M13 10V3L4 14h7v7l9-11h-7z"></path> {/* Example: lightning bolt */}
  </svg>
);

const serviceItems = [
  {
    title: "Environmental Reporting",
    description: "Comprehensive and actionable environmental reports tailored to your needs, helping you make informed decisions.",
    link: "/reports",
    icon: <PlaceholderIcon />, // Defaults to text-mygreen, which is good for the card background
  },
  {
    title: "Live Data Mapping",
    description: "Visualize real-time environmental data on interactive maps, offering insights into changing conditions.",
    link: "/live-map",
    icon: <PlaceholderIcon className="w-12 h-12 text-env-blue mb-4" />, // text-env-blue is also good
  },
  {
    title: "Expert Training Programs",
    description: "Empower your team with specialized training programs on environmental monitoring and data analysis.",
    link: "/training",
    icon: <PlaceholderIcon className="w-12 h-12 text-mygreen mb-4" />, // Changed from text-mygreen-light for better contrast
  },
];

const KeyServicesSection = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const cardsRef = useRef([]);
  cardsRef.current = []; // Reset on re-render

  const addToRefs = (el) => {
    if (el && !cardsRef.current.includes(el)) {
      cardsRef.current.push(el);
    }
  };

  useEffect(() => {
    const sectionEl = sectionRef.current;
    const titleEl = titleRef.current;

    // Animation for the section title
    gsap.fromTo(titleEl, 
      { autoAlpha: 0, y: 30 }, 
      {
        autoAlpha: 1, 
        y: 0, 
        duration: 0.8, 
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionEl,
          start: "top 80%", // When the top of the section hits 80% of the viewport height
          toggleActions: "play none none none", // Play animation once
        }
      }
    );

    // Animation for service cards
    cardsRef.current.forEach((card, index) => {
      gsap.fromTo(card, 
        { autoAlpha: 0, y: 50, scale: 0.95 }, 
        {
          autoAlpha: 1, 
          y: 0, 
          scale: 1,
          duration: 0.6,
          delay: index * 0.15, // Stagger effect
          ease: "power3.out",
          scrollTrigger: {
            trigger: card, // Trigger animation when the card itself enters viewport
            start: "top 85%",
            toggleActions: "play none none none",
          }
        }
      );
    });

  }, []);

  return (
    <section ref={sectionRef} className="py-12 md:py-20 bg-mygreen dark:bg-mygreen-dark">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={titleRef} className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Our Core Services
          </h2>
          <p className="mt-4 text-lg text-white opacity-90 max-w-2xl mx-auto">
            We provide innovative solutions to help you monitor, understand, and improve the environment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {serviceItems.map((service, index) => (
            <div 
              key={index} 
              ref={addToRefs}
              className="bg-white dark:bg-env-gray-darker rounded-xl shadow-lg p-6 md:p-8 hover:shadow-xl transition-shadow duration-300 flex flex-col items-center text-center transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 opacity-0"
            >
              {service.icon} {/* Simplified: Render icon directly */}
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                {service.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-6 flex-grow">
                {service.description}
              </p>
              <Link
                to={service.link}
                className="mt-auto inline-block bg-mygreen hover:bg-mygreen-dark text-white font-medium py-2 px-6 rounded-lg transition-colors duration-300"
              >
                Learn More
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default KeyServicesSection; 