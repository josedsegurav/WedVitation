import type { Metadata } from 'next'
import './globals.css'
import { THEME } from './theme.config'

export const metadata: Metadata = {
  title: `${THEME.fonts.display ? '' : ''}Sofia & Marco • Wedding Invitation`,
  description: 'You are invited to celebrate our love',
}

// ── Build Google Fonts URL from theme ─────────────────────────
// Encodes font names for the URL (spaces → +)
function fontParam(name: string) {
  return name.replace(/ /g, '+')
}

const FONT_URL = [
  `family=${fontParam(THEME.fonts.display)}:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400`,
  `family=${fontParam(THEME.fonts.script)}`,
  `family=${fontParam(THEME.fonts.body)}:wght@300;400;500`,
].join('&')

// ── Inject theme tokens as CSS custom properties ──────────────
// This runs server-side so the variables are available on first
// paint — no flash of unstyled content.
function buildThemeCSS(): string {
  const c = THEME.colors
  const f = THEME.fonts

  // Helper: hex → "r,g,b" for use in rgba() inside CSS
  function hexToRgb(hex: string): string {
    const h = hex.replace('#', '')
    if (h.length === 3) {
      return [
        parseInt(h[0]+h[0], 16),
        parseInt(h[1]+h[1], 16),
        parseInt(h[2]+h[2], 16),
      ].join(',')
    }
    return [
      parseInt(h.slice(0,2), 16),
      parseInt(h.slice(2,4), 16),
      parseInt(h.slice(4,6), 16),
    ].join(',')
  }

  // Only extract hex from solid colours (not rgba() strings)
  const goldRgb      = c.gold.startsWith('#')      ? hexToRgb(c.gold)      : '201,169,110'
  const goldLightRgb = c.goldLight.startsWith('#') ? hexToRgb(c.goldLight) : '232,213,176'
  const goldDarkRgb  = c.goldDark.startsWith('#')  ? hexToRgb(c.goldDark)  : '139,105,20'

  return `:root {
  /* Font utility class overrides — injected here so changing fonts in
     theme.config.ts automatically updates the .font-display/.font-script/.font-body
     classes used throughout all components */

  /* Backgrounds */
  --color-page-bg:      ${c.pageBg};
  --color-section-mid:  ${c.sectionMid};
  --color-section-end:  ${c.sectionEnd};
  --color-dark-bg:      ${c.darkBg};
  --color-dark-bg-mid:  ${c.darkBgMid};

  /* Card */
  --color-card-from:    ${c.cardFrom};
  --color-card-to:      ${c.cardTo};

  /* Accent */
  --color-gold:         ${c.gold};
  --color-gold-light:   ${c.goldLight};
  --color-gold-dark:    ${c.goldDark};
  --color-gold-rgb:     ${goldRgb};
  --color-gold-light-rgb: ${goldLightRgb};
  --color-gold-dark-rgb:  ${goldDarkRgb};

  /* Text */
  --color-heading:      ${c.heading};
  --color-body:         ${c.body};
  --color-muted:        ${c.muted};
  --color-btn-text:     ${c.buttonText};
  --color-heading-light:${c.headingLight};

  /* Derived gradients */
  --gradient-section:   linear-gradient(180deg, ${c.pageBg} 0%, ${c.sectionMid} 50%, ${c.pageBg} 100%);
  --gradient-card:      linear-gradient(160deg, ${c.cardFrom}, ${c.cardTo});
  --gradient-gold:      linear-gradient(135deg, ${c.gold} 0%, ${c.goldLight} 50%, ${c.goldDark} 100%);
  --gradient-gold-btn:  linear-gradient(135deg, ${c.gold}, ${c.goldDark});
  --gradient-dark:      linear-gradient(180deg, ${c.darkBg} 0%, ${c.darkBgMid} 50%, ${c.darkBg} 100%);
  --gradient-footer:    linear-gradient(180deg, ${c.sectionMid} 0%, ${c.sectionEnd} 100%);

  /* Borders */
  --color-border:       rgba(${goldRgb},0.28);
  --color-border-light: rgba(${goldRgb},0.18);
  --color-ornament:     rgba(${goldRgb},0.4);

  /* Ornament divider lines */
  --gradient-ornament-line-r: linear-gradient(to right, transparent, ${c.gold});
  --gradient-ornament-line-l: linear-gradient(to left,  transparent, ${c.gold});

  /* Card shadow */
  --shadow-card: 0 2px 16px rgba(${goldDarkRgb},0.06), inset 0 1px 0 rgba(255,255,255,0.8);

  /* Dark section (DressCode) text tones */
  --color-dark-text:          rgba(255,255,255,0.85);
  --color-dark-text-muted:    rgba(255,255,255,0.4);
  --color-dark-text-faint:    rgba(255,255,255,0.35);
  --color-dark-surface:       rgba(255,255,255,0.04);
  --color-dark-border:        rgba(255,255,255,0.08);
  --color-dark-swatch-border: rgba(255,255,255,0.18);

  /* Gallery */
  --color-gallery-overlay:  rgba(28,18,4,0.52);
  --color-gallery-text:     rgba(${goldLightRgb},0.9);
  --color-gallery-corner:   rgba(${goldLightRgb},0.5);

  /* FloatingRSVP button overlay */
  --color-float-border:     rgba(255,220,140,0.25);
  --color-float-rings:      rgba(255,240,200,0.7);
  --color-float-rings-fill: rgba(255,255,255,0.08);
  --color-float-curve:      rgba(255,240,200,0.4);
  --color-float-shimmer:    rgba(255,240,200,0.5);

  /* Envelope gradients */
  --gradient-envelope-flap:    linear-gradient(0deg,   color-mix(in srgb, ${c.gold} 85%, white), ${c.goldLight});
  --gradient-envelope-body:    linear-gradient(160deg, color-mix(in srgb, ${c.sectionMid} 90%, ${c.gold}), ${c.goldLight});
  --gradient-envelope-card:    linear-gradient(160deg, #FFFDF9, color-mix(in srgb, ${c.sectionMid} 60%, white));
  --gradient-wax-seal:         linear-gradient(135deg, color-mix(in srgb, ${c.gold} 90%, black), ${c.goldDark});
  --gradient-wax-highlight:    linear-gradient(170deg, color-mix(in srgb, ${c.goldLight} 90%, white), ${c.gold});

  /* Gallery placeholder gradients */
  --gradient-gallery-0: linear-gradient(160deg, ${c.goldDark}, color-mix(in srgb, ${c.goldDark} 70%, black));
  --gradient-gallery-1: linear-gradient(160deg, color-mix(in srgb, ${c.gold} 70%, #604020), color-mix(in srgb, ${c.goldDark} 60%, black));
  --gradient-gallery-2: linear-gradient(160deg, ${c.goldLight}, ${c.gold});
  --gradient-gallery-3: linear-gradient(160deg, color-mix(in srgb, ${c.gold} 55%, gray), color-mix(in srgb, ${c.goldDark} 50%, gray));
  --gradient-gallery-4: linear-gradient(160deg, ${c.gold}, ${c.goldDark});
  --gradient-gallery-5: linear-gradient(160deg, color-mix(in srgb, ${c.gold} 80%, gray), color-mix(in srgb, ${c.goldDark} 70%, gray));

  /* Dark card surface */
  --gradient-dark-card: linear-gradient(160deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02));

  /* Portrait overlay */
  --gradient-portrait-overlay: radial-gradient(circle, transparent 35%, rgba(44,20,4,0.35) 100%);

  /* FloatingRSVP shimmer */
  --gradient-float-shimmer: linear-gradient(to right, transparent, var(--color-float-shimmer), transparent);

  /* Petal particle colours */
  ${c.petals.map((p: string, i: number) => `--color-petal-${i}: ${p};`).join('\n  ')}
}

/* Font utility class overrides from theme.config.ts */
.font-display { font-family: '${f.display}', Georgia, serif !important; }
.font-script  { font-family: '${f.script}', cursive !important; }
.font-body    { font-family: '${f.body}', system-ui, sans-serif !important; }`
}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Theme tokens — injected before any styles load */}
        <style dangerouslySetInnerHTML={{ __html: buildThemeCSS() }} />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href={`https://fonts.googleapis.com/css2?${FONT_URL}&display=swap`}
          rel="stylesheet"
        />
      </head>
      <body className="bg-cream">{children}</body>
    </html>
  )
}
