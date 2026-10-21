import { useEffect } from "react"
import { useLocation } from "react-router"
import { SiteFooter } from "@/features/site/components/site-footer"
import { SiteNav } from "@/features/site/components/site-nav"
import { SlideUp } from "@/components/shared/reveal"
import { CallToAction } from "./components/call-to-action"
import { Demo } from "./components/demo"
import { FaqSection } from "./components/faq-section"
import { FeaturesSection } from "./components/features-section"
import { Hero } from "./components/hero"
import { HowItWorks } from "./components/how-it-works"

export default function LandingPage() {
  const { hash } = useLocation()

  // Coming from another page with a "/#section" link: scroll there once the page has rendered.
  useEffect(() => {
    if (hash) document.querySelector(hash)?.scrollIntoView()
  }, [hash])

  return (
    <div className="min-h-svh">
      <SiteNav />
      <main>
        <Hero />
        <section id="demo" className="scroll-mt-24 px-4">
          <div className="mx-auto max-w-6xl">
            <SlideUp>
              <Demo />
            </SlideUp>
          </div>
        </section>
        <FeaturesSection />
        <HowItWorks />
        <FaqSection />
        <CallToAction />
      </main>
      <SiteFooter />
    </div>
  )
}
