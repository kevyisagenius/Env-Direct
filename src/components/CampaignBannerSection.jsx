import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const CampaignBannerSection = () => {
  const [bannerData, setBannerData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const sectionRef = useRef(null);
  const contentWrapperRef = useRef(null); // Ref for the content wrapper that has initial opacity-0

  useEffect(() => {
    const fetchBannerData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/banner');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
        // Check if response is okay AND has content
        if (response.status === 204) { // No Content
            console.warn("Campaign banner API returned 204 No Content");
            setBannerData({}); // Set to an empty object to indicate successful fetch but no data
        } else {
            const data = await response.json();
            setBannerData(data);
        }
      } catch (e) {
        console.error("Failed to fetch campaign banner:", e);
        setError("Failed to load campaign information. " + e.message);
      }
      setIsLoading(false);
    };
    fetchBannerData();
  }, []);

  useEffect(() => {
    // Animate content when bannerData is available (even if empty object, indicating API call finished)
    // and section is visible
    if (!isLoading && contentWrapperRef.current && sectionRef.current) {
        // First, make the wrapper visible
        gsap.to(contentWrapperRef.current, {
            autoAlpha: 1, // Make the wrapper visible
            duration: 0.01, // Almost instant, just to remove opacity-0
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 85%", // A bit earlier to ensure wrapper is visible before children animate
                toggleActions: "play none none none",
            }
        });

        // Then animate children if bannerData is not null and has keys (i.e. not an empty object from 204)
        if (bannerData && Object.keys(bannerData).length > 0) {
            gsap.fromTo(contentWrapperRef.current.children, 
            { autoAlpha: 0, y: 30 }, 
            {
                autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.2, ease: "power3.out",
                scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 80%", // Children animate slightly after wrapper is definitely visible
                toggleActions: "play none none none",
                }
            }
            );
        }
    }
  }, [bannerData, isLoading]); // Rerun when bannerData or isLoading changes

  // Render loading state
  if (isLoading) {
    return (
      <section className="py-16 md:py-24 bg-mygreen dark:bg-mygreen-dark text-white text-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-xl">Loading campaign details...</p>
        </div>
      </section>
    );
  }

  // Render error state if no banner data is available to render a fallback
  if (error && (!bannerData || Object.keys(bannerData).length === 0)) {
    return (
      <section className="py-16 md:py-24 bg-mygreen dark:bg-mygreen-dark text-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-xl text-red-300">{error}</p>
            <p className="text-sm text-gray-300 mt-2">Please check the API or network connection.</p>
        </div>
      </section>
    );
  }

  // If there is no banner data (e.g. API returned empty object from 204, or null from an issue not caught as error)
  // and no error state is active, render a minimal fallback or null.
  // Here we use the bannerData potentially being an empty object for fallback content.
  const headline = bannerData?.headline || "Join Our Coastal Cleanup Campaign!";
  const description = bannerData?.description || "Help keep Dominica's beaches pristine. Join volunteers for our monthly cleanup.";
  const ctaText = bannerData?.ctaText || "Register Now";
  const ctaLink = bannerData?.ctaLink || "/register-cleanup";
  const textColor = bannerData?.textColor || "text-white";

  // If API call finished (not loading) but bannerData is effectively empty for UI (e.g. from 204)
  // and no error was explicitly set, we might still want to show something or hide section.
  // The logic above will use default text if bannerData is an empty object.
  // If bannerData is strictly null and no error, then the section could be hidden based on requirements.
  // For now, if !isLoading and bannerData is null (and not error), default content will be shown. If it was an empty object, default content also shown.

  return (
    <section 
      ref={sectionRef}
      className={`py-20 md:py-28 bg-mygreen dark:bg-mygreen-dark ${textColor} relative overflow-hidden`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div ref={contentWrapperRef} className="max-w-3xl mx-auto opacity-0"> {/* Initial opacity-0 for GSAP */} 
            <h2 className={`text-4xl md:text-5xl font-bold mb-6 leading-tight`}>
              {headline}
            </h2>
            <p className={`text-lg md:text-xl opacity-90 mb-10`}>
              {description}
            </p>
            <Link
              to={ctaLink}
              className={`inline-block bg-white hover:bg-gray-100 text-mygreen-dark dark:bg-mygreen-light dark:hover:bg-mygreen dark:text-mygreen-dark font-bold py-4 px-10 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 text-lg transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-mygreen-light focus:ring-opacity-50`}
            >
              {ctaText}
            </Link>
          </div>
      </div>
    </section>
  );
};

export default CampaignBannerSection;
