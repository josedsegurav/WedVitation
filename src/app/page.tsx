'use client'

import { useState, useEffect, useRef } from 'react'
import EnvelopeOpener from '@/components/EnvelopeOpener'
import HeroSection from '@/components/HeroSection'
import CountdownSection from '@/components/CountdownSection'
import ParentsSection from '@/components/ParentsSection'
import EventSection from '@/components/EventSection'
import DressCodeSection from '@/components/DressCodeSection'
import GallerySection from '@/components/GallerySection'
import ItinerarySection from '@/components/ItinerarySection'
import GiftSection from '@/components/GiftSection'
import RSVPSection from '@/components/RSVPSection'
import FooterSection from '@/components/FooterSection'
import FloatingRSVP from '@/components/FloatingRSVP'
import PetalParticles from '@/components/PetalParticles'

export default function WeddingPage() {
  const [envelopeOpened, setEnvelopeOpened] = useState(false)
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    if (envelopeOpened) {
      setTimeout(() => setShowContent(true), 800)
    }
  }, [envelopeOpened])

  // Reveal on scroll
  useEffect(() => {
    if (!showContent) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.1 }
    )
    const elements = document.querySelectorAll('.reveal')
    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [showContent])

  if (!envelopeOpened) {
    return <EnvelopeOpener onOpen={() => setEnvelopeOpened(true)} />
  }

  return (
    <div
      className={`min-h-screen transition-opacity duration-1000 ${
        showContent ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <PetalParticles />
      <HeroSection />
      <CountdownSection />
      <ParentsSection />
      <EventSection />
      <DressCodeSection />
      <GallerySection />
      <ItinerarySection />
      <GiftSection />
      <RSVPSection />
      <FooterSection />
      <FloatingRSVP />
    </div>
  )
}
