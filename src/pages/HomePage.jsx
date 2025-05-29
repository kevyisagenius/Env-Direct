import React from 'react';
import HeroSection from '../components/HeroSection';
import KeyServicesSection from '../components/KeyServicesSection';
import CallToActionSection from '../components/CallToActionSection';
import LiveDataDashboardSection from '../components/LiveDataDashboardSection';
import CampaignBannerSection from '../components/CampaignBannerSection';
import RegionRankingSection from '../components/RegionRankingSection';
import PredictionsSection from '../components/PredictionsSection';
// import OtherSections from '../components/OtherSections'; // Example for future sections

const HomePage = () => {
  return (
    <>
      <HeroSection />
      <KeyServicesSection />
      <CallToActionSection />
      <LiveDataDashboardSection />
      <CampaignBannerSection />
      <RegionRankingSection />
      <PredictionsSection />
      {/* 
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-center mb-12 dark:text-white">Key Features</h2>
        Placeholder for other content sections that might be on the homepage
        <OtherSections /> 
      </div> 
      */}
      {/* Add more sections to your homepage as needed */}
    </>
  );
};

export default HomePage; 