import { HeroSection } from "@/components/sections/HeroSection"
import { PremiumExperienceSection } from "@/components/sections/PremiumExperienceSection"
import { WorldGallerySection } from "@/components/sections/WorldGallerySection"
import { MatchesSection } from "@/components/sections/MatchesSection"
import { BirthdaySection } from "@/components/sections/BirthdaySection"
import { TestimonialsSection } from "@/components/sections/TestimonialsSection"
import { NewsletterSection } from "@/components/sections/NewsletterSection"

export default function Home() {
  return (
    <>
      <HeroSection />
      <PremiumExperienceSection />
      <BirthdaySection />
      <WorldGallerySection />
      <MatchesSection />
      <TestimonialsSection />
      <NewsletterSection />
    </>
  );
}
