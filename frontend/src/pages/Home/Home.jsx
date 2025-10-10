import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import HeroSection from "../../components/HeroSection/HeroSection";
import ReasonSection from "../../components/ReasonSection/ReasonSection";
import ServicesSection from "../../components/ServicesSection/ServicesSection";
import TeamSection from "../../components/TeamSection/TeamSection";
import TestimonialSection from "../../components/TestimonialSection/TestimonialSection";
import FeedbackSection from "../../components/FeedbackSection/FeedbackSection";
import Footer from "../../components/Footer/Footer";

const Home = () => {
  return (
    <>
      <Navbar />
      <HeroSection />
      <ReasonSection />
      <ServicesSection />
      <TeamSection />
      <TestimonialSection />
      <FeedbackSection />
      <Footer />
    </>
  );
};

export default Home;
