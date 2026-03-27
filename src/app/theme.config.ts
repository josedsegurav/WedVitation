// ============================================================
//  WEDDING INVITATION — THEME CONFIG
//  Edit this file to change the look of the entire invitation.
//  Colours and fonts flow through CSS variables into every
//  component automatically — no component files need touching.
//
//  HOW IT WORKS
//  ────────────
//  1. Values here are turned into CSS custom properties in
//     globals.css via the applyTheme() call in layout.tsx.
//  2. Tailwind classes (font-display, font-script, text-gold …)
//     read from these same variables via tailwind.config.ts.
//  3. Inline styles in components use var(--…) references that
//     automatically inherit whatever you set here.
//
//  PRESET PALETTES (uncomment one, or write your own)
//  ───────────────────────────────────────────────────
//  The default "Warm Gold" palette is active below.
//  Scroll down for "Dusty Rose", "Sage Garden", and "Midnight".
// ============================================================

export const THEME = {

  // ── Fonts ─────────────────────────────────────────────────
  // Any Google Font name works. Update the import URL in
  // layout.tsx if you add a new font family.
  fonts: {
    /** Elegant serif — headings, countdown numbers, card titles */
    display: 'Cormorant Garamond',
    /** Handwritten script — couple name, RSVP thank-you, hero */
    script:  'Great Vibes',
    /** Clean sans-serif — body text, labels, UI elements */
    body:    'Jost',
  },

  // ── Palette ───────────────────────────────────────────────
  colors: {

    // ── Background & surface ─────────────────────────────
    /** Page background — lightest cream */
    pageBg:        '#FAF6F0',
    /** Section gradient mid-stop */
    sectionMid:    '#F5EDE0',
    /** Section gradient end-stop */
    sectionEnd:    '#EDE0CC',
    /** Dark section background (DressCodeSection) */
    darkBg:        '#1C1C1C',
    /** Dark section mid-stop */
    darkBgMid:     '#242424',

    // ── Card surface ─────────────────────────────────────
    /** Card gradient start */
    cardFrom:      'rgba(253,248,242,0.95)',
    /** Card gradient end */
    cardTo:        'rgba(245,237,224,0.8)',

    // ── Primary accent (gold) ─────────────────────────────
    /** Main gold — ornaments, icons, eyebrows, borders */
    gold:          '#C9A96E',
    /** Light gold — gradient highlights, text shimmer */
    goldLight:     '#E8D5B0',
    /** Dark gold — labels, secondary text, hover states */
    goldDark:      '#8B6914',

    // ── Text ─────────────────────────────────────────────
    /** Primary headings */
    heading:       '#2C2C2C',
    /** Body / italic text */
    body:          '#5C4A2A',
    /** Muted / subtext */
    muted:         '#8B6914',

    // ── Semantic ─────────────────────────────────────────
    /** Button text on gold background */
    buttonText:    '#FAF6F0',
    /** Light section heading (used on dark DressCode bg) */
    headingLight:  '#F5EDE0',

    // ── Petal particles ───────────────────────────────────
    /** Array of colours for falling petal animation */
    petals: ['#F2DDD5', '#E8C8B0', '#D4A8B0', '#C9A96E', '#F0E0D0'],
  },
}

// ============================================================
//  PRESET: DUSTY ROSE
//  Soft pinks and mauves — romantic, feminine
// ============================================================
// export const THEME = {
//   fonts: {
//     display: 'Playfair Display',
//     script:  'Alex Brush',
//     body:    'Lato',
//   },
//   colors: {
//     pageBg:       '#FDF7F5',
//     sectionMid:   '#F5E6E0',
//     sectionEnd:   '#EDD5CC',
//     darkBg:       '#2A1A1A',
//     darkBgMid:    '#321F1F',
//     cardFrom:     'rgba(253,247,245,0.96)',
//     cardTo:       'rgba(245,230,224,0.82)',
//     gold:         '#C9848A',
//     goldLight:    '#E8B8BC',
//     goldDark:     '#8B4A50',
//     heading:      '#2C2024',
//     body:         '#5C3A3E',
//     muted:        '#8B4A50',
//     buttonText:   '#FDF7F5',
//     headingLight: '#F5E0DC',
//     petals: ['#F2C4C4', '#E8A0A8', '#D48090', '#C98490', '#F0D8D8'],
//   },
// }

// ============================================================
//  PRESET: SAGE GARDEN
//  Earthy greens and warm ivory — botanical, natural
// ============================================================
// export const THEME = {
//   fonts: {
//     display: 'Cormorant Garamond',
//     script:  'Pinyon Script',
//     body:    'Raleway',
//   },
//   colors: {
//     pageBg:       '#F6F8F2',
//     sectionMid:   '#EAF0E4',
//     sectionEnd:   '#DDE8D4',
//     darkBg:       '#1A211A',
//     darkBgMid:    '#202820',
//     cardFrom:     'rgba(246,248,242,0.96)',
//     cardTo:       'rgba(234,240,228,0.82)',
//     gold:         '#7A9E7E',
//     goldLight:    '#AECDB2',
//     goldDark:     '#4A6E4E',
//     heading:      '#202820',
//     body:         '#3A5040',
//     muted:        '#4A6E4E',
//     buttonText:   '#F6F8F2',
//     headingLight: '#E4EEE0',
//     petals: ['#C8DBC4', '#A8C8AC', '#88B48C', '#7A9E7E', '#E0EED8'],
//   },
// }

// ============================================================
//  PRESET: MIDNIGHT
//  Navy and champagne — dramatic, formal, black tie
// ============================================================
// export const THEME = {
//   fonts: {
//     display: 'EB Garamond',
//     script:  'Great Vibes',
//     body:    'Montserrat',
//   },
//   colors: {
//     pageBg:       '#F5F5F0',
//     sectionMid:   '#EAEAE0',
//     sectionEnd:   '#DCDCD0',
//     darkBg:       '#0D1B2A',
//     darkBgMid:    '#122030',
//     cardFrom:     'rgba(245,245,240,0.96)',
//     cardTo:       'rgba(234,234,224,0.82)',
//     gold:         '#C4A84A',
//     goldLight:    '#E0CC90',
//     goldDark:     '#8A7020',
//     heading:      '#0D1B2A',
//     body:         '#2A3A4A',
//     muted:        '#6A7A8A',
//     buttonText:   '#F5F5F0',
//     headingLight: '#E8E8DC',
//     petals: ['#E0D8B0', '#D0C890', '#C4B870', '#B8A850', '#ECD890'],
//   },
// }

// ── Derived helpers (do not edit) ─────────────────────────────
// These are consumed by applyTheme() in layout.tsx
export type Theme = typeof THEME
