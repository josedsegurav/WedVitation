'use client'

import { useEffect, useRef } from 'react'

const COLORS = ['#F2DDD5', '#E8C8B0', '#D4A8B0', '#C9A96E', '#F0E0D0']

export default function PetalParticles() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const petals: HTMLElement[] = []

    for (let i = 0; i < 12; i++) {
      const petal = document.createElement('div')
      const color = COLORS[Math.floor(Math.random() * COLORS.length)]
      const size = Math.random() * 10 + 6
      const left = Math.random() * 100
      const delay = Math.random() * 10
      const duration = Math.random() * 8 + 8

      petal.style.cssText = `
        position: fixed;
        width: ${size}px;
        height: ${size * 0.65}px;
        border-radius: 50% 50% 50% 0;
        background: ${color};
        opacity: 0;
        left: ${left}%;
        top: -20px;
        animation: petalFall ${duration}s ${delay}s linear infinite;
        pointer-events: none;
        z-index: 1;
        transform-origin: center;
        transform: rotate(${Math.random() * 360}deg);
      `

      container.appendChild(petal)
      petals.push(petal)
    }

    return () => {
      petals.forEach(p => p.remove())
    }
  }, [])

  return <div ref={containerRef} className="pointer-events-none" />
}
