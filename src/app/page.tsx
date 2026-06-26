import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Hero from "@/components/sections/Hero";
import StatBand from "@/components/sections/StatBand";
import ProblemAgitation from "@/components/sections/ProblemAgitation";
import Headlines from "@/components/sections/Headlines";
import BrandIntro from "@/components/sections/BrandIntro";
import FloridaMap from "@/components/sections/FloridaMap";
import NationalMap from "@/components/sections/NationalMap";
import Process from "@/components/sections/Process";
import ClosingCta from "@/components/sections/ClosingCta";
import ComparisonTable from "@/components/sections/ComparisonTable";

export default function Home() {
  return (
    <>
      <Nav />
      <main id="top" className="flex-1">
        <Hero />
        <StatBand />
        <ProblemAgitation />
        <Headlines />
        <BrandIntro />
        <FloridaMap />
        <NationalMap />
        <Process />
        <ClosingCta />
        <ComparisonTable />
      </main>
      <Footer />
    </>
  );
}
