import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/home/hero-section"
import { BannerSection } from "@/components/home/banner-section"
import { LatestAnnouncement } from "@/components/home/latest-announcement"
import { WelcomeSection } from "@/components/home/welcome-section"
import { DeanSection } from "@/components/home/dean-section"
import { MeetAuthoritiesSection } from "@/components/home/meet-authorities-section"
import { DepartmentsSection } from "@/components/home/departments-section"
import { NewsEventsSection } from "@/components/home/news-events-section"
import { AuthoritiesSection } from "@/components/home/authorities-section"
import { StatsSection } from "@/components/home/stats-section"
import { FacilitiesSection } from "@/components/home/facilities-section"
import { AnnouncementPopup } from "@/components/home/announcement-popup"
import { AnnouncementBanner } from "@/components/home/announcement-banner"
import { QuickLinksSection } from "@/components/home/quick-links-section"
import { TestimonialsSection } from "@/components/home/testimonials-section"
import { CustomBlocksSection } from "@/components/home/custom-blocks-section"
import { MinistersSection } from "@/components/home/ministers-section"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <AnnouncementBanner />
      <Header />
      <main className="flex-1">
        <LatestAnnouncement />
        <BannerSection />
        <HeroSection />
        <QuickLinksSection />
        <WelcomeSection />
        <StatsSection />
        <NewsEventsSection />
        <MinistersSection />
        <DeanSection />
        <MeetAuthoritiesSection />
        <AuthoritiesSection />
        <FacilitiesSection />
        <DepartmentsSection />
        <TestimonialsSection />
        <CustomBlocksSection />
      </main>
      <Footer />
      <AnnouncementPopup />
    </div>
  )
}
