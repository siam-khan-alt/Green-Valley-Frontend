import HeroSection from "@/components/public/sections/HeroSection";
import TrustedStatsSection from "@/components/public/sections/TrustedStatsSection";
import ServicesSection from "@/components/public/sections/ServicesSection";
import FeaturedProjectsSection from "@/components/public/sections/FeaturedProjectsSection";
import WhyChooseUsSection from "@/components/public/sections/WhyChooseUsSection";
import ProcessSection from "@/components/public/sections/ProcessSection";
import EngineeringQualitySection from "@/components/public/sections/EngineeringQualitySection";
import SafetySustainabilitySection from "@/components/public/sections/SafetySustainabilitySection";
import LeadershipTeamSection from "@/components/public/sections/LeadershipTeamSection";
import TestimonialsSection from "@/components/public/sections/TestimonialsSection";
import FaqSection from "@/components/public/sections/FaqSection";
import CtaBannerSection from "@/components/public/sections/CtaBannerSection";
import PartnersSection from "@/components/public/sections/PartnersSection";

export default function PublicLandingPage() {
  return (
    <div>
      <HeroSection />
      <TrustedStatsSection />
      <ServicesSection />
      <FeaturedProjectsSection />
      <WhyChooseUsSection />
      <ProcessSection />
      <EngineeringQualitySection />
      <SafetySustainabilitySection />
      <LeadershipTeamSection />
      <TestimonialsSection />
      <FaqSection />
      <CtaBannerSection />
      <PartnersSection />
    </div>
  );
}