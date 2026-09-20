import Navbar from "../components/Home/Navbar";
import Hero from "../components/Home/Hero";
import PlatformLogos from "../components/Home/PlatformLogos";
import HowItWorks from "../components/Home/HowItWorks";
import ShowcaseAI from "../components/Home/ShowcaseAI";
import ShowcaseScheduler from "../components/Home/ShowcaseScheduler";
import CTA from "../components/Home/CTA";
import Footer from "../components/Home/Footer";

export default function Home() {
    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans">
            <Navbar />
            <Hero />
            <PlatformLogos />
            <HowItWorks />
            <ShowcaseAI />
            <ShowcaseScheduler />
            <CTA />
            <Footer />
        </div>
    );
}
