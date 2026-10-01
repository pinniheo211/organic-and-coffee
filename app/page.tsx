import { HeroBanner } from "@/components/hero-banner";
import { HomeBase } from "@/components/home-base";
import { SiteHeader } from "@/components/site-header";

export default function Home() {
  return (
    <div id="top">
      <SiteHeader />
      <main>
        <HeroBanner />
        <HomeBase />
      </main>
    </div>
  );
}
