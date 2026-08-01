import Hero from "../components/home/Hero";
import AlertBar from "../components/home/AlertBar";
import Statistics from "../components/home/Statistics";
import Features from "../components/home/Features";
import Testimonials from "../components/home/Testimonials";
import EmergencyContacts from "../components/home/EmergencyContacts";
import NewsSection from "../components/home/NewsSection";
import WeatherWidget from "../components/home/WeatherWidget";

function Home() {
  return (
    <>
      <Hero />
      <AlertBar />
      <Statistics />
      <Features />
      <Testimonials />
      <EmergencyContacts />
      <NewsSection />
      <WeatherWidget />
    </>
  );
}

export default Home;