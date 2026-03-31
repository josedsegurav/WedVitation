// lib/themes.ts
// ── Shared theme definitions ──────────────────────────────────
// No 'use client' — safe to import in both Server and Client Components.

export type ThemePreset = {
    id:          string
    name:        string
    description: string
    fonts: {
      display: string
      script:  string
      body:    string
    }
    colors: {
      pageBg:       string
      sectionMid:   string
      sectionEnd:   string
      darkBg:       string
      darkBgMid:    string
      cardFrom:     string
      cardTo:       string
      gold:         string
      goldLight:    string
      goldDark:     string
      heading:      string
      body:         string
      muted:        string
      buttonText:   string
      headingLight: string
      petals:       string[]
    }
  }

  export const PRESETS: ThemePreset[] = [
    {
      id: 'warm-gold',
      name: 'Warm Gold',
      description: 'Classic ivory & gold — timeless elegance',
      fonts: { display: 'Cormorant Garamond', script: 'Great Vibes', body: 'Jost' },
      colors: {
        pageBg: '#FAF6F0', sectionMid: '#F5EDE0', sectionEnd: '#EDE0CC',
        darkBg: '#1C1C1C', darkBgMid: '#242424',
        cardFrom: 'rgba(253,248,242,0.95)', cardTo: 'rgba(245,237,224,0.8)',
        gold: '#C9A96E', goldLight: '#E8D5B0', goldDark: '#8B6914',
        heading: '#2C2C2C', body: '#5C4A2A', muted: '#8B6914',
        buttonText: '#FAF6F0', headingLight: '#F5EDE0',
        petals: ['#F2DDD5', '#E8C8B0', '#D4A8B0', '#C9A96E', '#F0E0D0'],
      },
    },
    {
      id: 'dusty-rose',
      name: 'Dusty Rose',
      description: 'Soft pinks & mauves — romantic, feminine',
      fonts: { display: 'Playfair Display', script: 'Alex Brush', body: 'Lato' },
      colors: {
        pageBg: '#FDF7F5', sectionMid: '#F5E6E0', sectionEnd: '#EDD5CC',
        darkBg: '#2A1A1A', darkBgMid: '#321F1F',
        cardFrom: 'rgba(253,247,245,0.96)', cardTo: 'rgba(245,230,224,0.82)',
        gold: '#C9848A', goldLight: '#E8B8BC', goldDark: '#8B4A50',
        heading: '#2C2024', body: '#5C3A3E', muted: '#8B4A50',
        buttonText: '#FDF7F5', headingLight: '#F5E0DC',
        petals: ['#F2C4C4', '#E8A0A8', '#D48090', '#C98490', '#F0D8D8'],
      },
    },
    {
      id: 'sage-garden',
      name: 'Sage Garden',
      description: 'Earthy greens & ivory — botanical, natural',
      fonts: { display: 'Cormorant Garamond', script: 'Pinyon Script', body: 'Raleway' },
      colors: {
        pageBg: '#F6F8F2', sectionMid: '#EAF0E4', sectionEnd: '#DDE8D4',
        darkBg: '#1A211A', darkBgMid: '#202820',
        cardFrom: 'rgba(246,248,242,0.96)', cardTo: 'rgba(234,240,228,0.82)',
        gold: '#7A9E7E', goldLight: '#AECDB2', goldDark: '#4A6E4E',
        heading: '#202820', body: '#3A5040', muted: '#4A6E4E',
        buttonText: '#F6F8F2', headingLight: '#E4EEE0',
        petals: ['#C8DBC4', '#A8C8AC', '#88B48C', '#7A9E7E', '#E0EED8'],
      },
    },
    {
      id: 'midnight',
      name: 'Midnight',
      description: 'Navy & champagne — dramatic, black tie',
      fonts: { display: 'EB Garamond', script: 'Great Vibes', body: 'Montserrat' },
      colors: {
        pageBg: '#F5F5F0', sectionMid: '#EAEAE0', sectionEnd: '#DCDCD0',
        darkBg: '#0D1B2A', darkBgMid: '#122030',
        cardFrom: 'rgba(245,245,240,0.96)', cardTo: 'rgba(234,234,224,0.82)',
        gold: '#C4A84A', goldLight: '#E0CC90', goldDark: '#8A7020',
        heading: '#0D1B2A', body: '#2A3A4A', muted: '#6A7A8A',
        buttonText: '#F5F5F0', headingLight: '#E8E8DC',
        petals: ['#E0D8B0', '#D0C890', '#C4B870', '#B8A850', '#ECD890'],
      },
    },
  ]

  export function getPreset(id: string): ThemePreset {

    return PRESETS.find(p => p.id === id) ?? PRESETS[0]
  }

  // ── Builds the full :root CSS block for a preset ──────────────
  export function buildThemeCSS(preset: ThemePreset): string {
    const c = preset.colors
    const f = preset.fonts

    function hexToRgb(hex: string): string {
      const h = hex.replace('#', '')
      if (h.length === 3) {
        return [parseInt(h[0]+h[0],16), parseInt(h[1]+h[1],16), parseInt(h[2]+h[2],16)].join(',')
      }
      return [parseInt(h.slice(0,2),16), parseInt(h.slice(2,4),16), parseInt(h.slice(4,6),16)].join(',')
    }

    const goldRgb      = c.gold.startsWith('#')      ? hexToRgb(c.gold)      : '201,169,110'
    const goldLightRgb = c.goldLight.startsWith('#') ? hexToRgb(c.goldLight) : '232,213,176'
    const goldDarkRgb  = c.goldDark.startsWith('#')  ? hexToRgb(c.goldDark)  : '139,105,20'

    return `:root {
    --color-page-bg:      ${c.pageBg};
    --color-section-mid:  ${c.sectionMid};
    --color-section-end:  ${c.sectionEnd};
    --color-dark-bg:      ${c.darkBg};
    --color-dark-bg-mid:  ${c.darkBgMid};
    --color-card-from:    ${c.cardFrom};
    --color-card-to:      ${c.cardTo};
    --color-gold:         ${c.gold};
    --color-gold-light:   ${c.goldLight};
    --color-gold-dark:    ${c.goldDark};
    --color-gold-rgb:     ${goldRgb};
    --color-gold-light-rgb: ${goldLightRgb};
    --color-gold-dark-rgb:  ${goldDarkRgb};
    --color-heading:      ${c.heading};
    --color-body:         ${c.body};
    --color-muted:        ${c.muted};
    --color-btn-text:     ${c.buttonText};
    --color-heading-light:${c.headingLight};
    --color-border:       rgba(${goldRgb},0.28);
    --color-border-light: rgba(${goldRgb},0.18);
    --color-ornament:     rgba(${goldRgb},0.4);
    --gradient-section:   linear-gradient(180deg,${c.pageBg} 0%,${c.sectionMid} 50%,${c.pageBg} 100%);
    --gradient-card:      linear-gradient(160deg,${c.cardFrom},${c.cardTo});
    --gradient-gold:      linear-gradient(135deg,${c.gold} 0%,${c.goldLight} 50%,${c.goldDark} 100%);
    --gradient-gold-btn:  linear-gradient(135deg,${c.gold},${c.goldDark});
    --gradient-dark:      linear-gradient(180deg,${c.darkBg} 0%,${c.darkBgMid} 50%,${c.darkBg} 100%);
    --gradient-footer:    linear-gradient(180deg,${c.sectionMid} 0%,${c.sectionEnd} 100%);
    --gradient-ornament-line-r: linear-gradient(to right,transparent,${c.gold});
    --gradient-ornament-line-l: linear-gradient(to left, transparent,${c.gold});
    --shadow-card: 0 2px 16px rgba(${goldDarkRgb},0.06),inset 0 1px 0 rgba(255,255,255,0.8);
    --color-dark-text:          rgba(255,255,255,0.85);
    --color-dark-text-muted:    rgba(255,255,255,0.4);
    --color-dark-text-faint:    rgba(255,255,255,0.35);
    --color-dark-surface:       rgba(255,255,255,0.04);
    --color-dark-border:        rgba(255,255,255,0.08);
    --color-dark-swatch-border: rgba(255,255,255,0.18);
    --color-gallery-overlay:    rgba(28,18,4,0.52);
    --color-gallery-text:       rgba(${goldLightRgb},0.9);
    --color-gallery-corner:     rgba(${goldLightRgb},0.5);
    --color-float-border:       rgba(255,220,140,0.25);
    --color-float-rings:        rgba(255,240,200,0.7);
    --color-float-rings-fill:   rgba(255,255,255,0.08);
    --color-float-curve:        rgba(255,240,200,0.4);
    --color-float-shimmer:      rgba(255,240,200,0.5);
    --gradient-envelope-flap:   linear-gradient(0deg,color-mix(in srgb,${c.gold} 85%,white),${c.goldLight});
    --gradient-envelope-body:   linear-gradient(160deg,color-mix(in srgb,${c.sectionMid} 90%,${c.gold}),${c.goldLight});
    --gradient-envelope-card:   linear-gradient(160deg,#FFFDF9,color-mix(in srgb,${c.sectionMid} 60%,white));
    --gradient-wax-seal:        linear-gradient(135deg,color-mix(in srgb,${c.gold} 90%,black),${c.goldDark});
    --gradient-wax-highlight:   linear-gradient(170deg,color-mix(in srgb,${c.goldLight} 90%,white),${c.gold});
    --gradient-gallery-0: linear-gradient(160deg,${c.goldDark},color-mix(in srgb,${c.goldDark} 70%,black));
    --gradient-gallery-1: linear-gradient(160deg,color-mix(in srgb,${c.gold} 70%,#604020),color-mix(in srgb,${c.goldDark} 60%,black));
    --gradient-gallery-2: linear-gradient(160deg,${c.goldLight},${c.gold});
    --gradient-gallery-3: linear-gradient(160deg,color-mix(in srgb,${c.gold} 55%,gray),color-mix(in srgb,${c.goldDark} 50%,gray));
    --gradient-gallery-4: linear-gradient(160deg,${c.gold},${c.goldDark});
    --gradient-gallery-5: linear-gradient(160deg,color-mix(in srgb,${c.gold} 80%,gray),color-mix(in srgb,${c.goldDark} 70%,gray));
    --gradient-dark-card: linear-gradient(160deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02));
    --gradient-portrait-overlay: radial-gradient(circle,transparent 35%,rgba(44,20,4,0.35) 100%);
    --gradient-float-shimmer: linear-gradient(to right,transparent,var(--color-float-shimmer),transparent);
    ${c.petals.map((p, i) => `--color-petal-${i}: ${p};`).join('\n  ')}
  }
  .font-display { font-family: '${f.display}', Georgia, serif !important; }
  .font-script  { font-family: '${f.script}', cursive !important; }
  .font-body    { font-family: '${f.body}', system-ui, sans-serif !important; }`
  }

  // ── Google Fonts URL for a preset ────────────────────────────
  export function buildFontsUrl(preset: ThemePreset): string {
    const encode = (s: string) => s.replace(/ /g, '+')
    return [
      `family=${encode(preset.fonts.display)}:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400`,
      `family=${encode(preset.fonts.script)}`,
      `family=${encode(preset.fonts.body)}:wght@300;400;500`,
    ].join('&')
  }