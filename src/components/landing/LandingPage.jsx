import React from 'react';
import Navigation from './Navigation';
import Hero from './Hero';
import StatsBar from './StatsBar';
import PipelineOverview from './PipelineOverview';
import EngineGrid from './EngineGrid';
import HostShowcase from './HostShowcase';
import ABTestingSection from './ABTestingSection';
import DistributionSection from './DistributionSection';
import RoadmapSection from './RoadmapSection';
import CTASection from './CTASection';
import Footer from './Footer';

const LandingPage = ({ onNavigate }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation onNavigate={onNavigate} />
      <main className="pt-20 flex-1">
        <Hero onNavigate={onNavigate} />
        <StatsBar />
        <PipelineOverview />
        <EngineGrid />
        <HostShowcase />
        <ABTestingSection />
        <DistributionSection />
        <RoadmapSection />
        <CTASection onNavigate={onNavigate} />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
