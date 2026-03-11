// ============================================================
//  WEDDING INVITATION — CONFIG
//  Edit this file to fully customise the invitation.
//  No other files need to be touched for content changes.
// ============================================================

const DATE = new Date('2026-06-15');
// ── Couple ──────────────────────────────────────────────────
export const COUPLE = {
    bride:       'Sofia',
    groom:       'Marco',
    /** Displayed as script headline throughout */
    names:       'Sofia & Marco',
    /** Short monogram shown in the envelope wax seal & medallion */
    monogram:    'S & M',
    /** Initial on the wax seal */
    sealInitial: 'SM',
  }

  // ── Wedding date & venue ─────────────────────────────────────
  export const WEDDING = {
    /** Used by the live countdown timer */
    dateISO:     `${DATE.toISOString()}`,
    dateCalendar: `${DATE.getFullYear()}${(DATE.getMonth() + 1).toString().padStart(2, '0')}${(DATE.getDate() + 1).toString().padStart(2, '0')}`,
    /** Human-readable date shown in UI */
    dateDisplay: `${DATE.getDate() + 1} ${DATE.toLocaleDateString('en-US', { month: 'long' })} ${DATE.getFullYear()}`,
    /** Shown inside the hero medallion */
    dateMedallion: `${DATE.getDate()} ${DATE.toLocaleDateString('en-US', { month: 'long' })} · ${DATE.getFullYear()}`,
    location:    'Iglesia Católica Sagrada Familia - El Condado',
    /** RSVP deadline shown in the form */
    rsvpDeadline: `${new Date(DATE.getFullYear(), DATE.getMonth(), DATE.getDate() - 15).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`,
    rsvpDeadlineISO: `${new Date(DATE.getFullYear(), DATE.getMonth(), DATE.getDate() - 1).toISOString()}`,
  }

  // ── Families / parents ───────────────────────────────────────
  export const FAMILIES = [
    { label: "Bride's Family", family: 'Rossi Family',    parents: 'Antonio & Lucia Rossi'     },
    { label: "Groom's Family", family: 'De Luca Family',  parents: 'Giovanni & Elena De Luca'  },
  ]

  // ── Events ───────────────────────────────────────────────────
  export const EVENTS = [
    {
      type:    'ceremony' as const,
      venue:   'Cathedral of Santa Maria',
      date:    `${DATE.getDate() + 1} ${DATE.toLocaleDateString('en-US', { month: 'long' })} ${DATE.getFullYear()}`,
      time:    '11:00',
      ampm:    'A.M.',
      address: 'Piazza del Duomo, Florence, Tuscany, Italy',
      mapsUrl: `https://maps.google.com/?q=${WEDDING.location}`,
    },
    {
      type:    'reception' as const,
      venue:   'Villa La Signoria',
      date:    `${DATE.getDate() + 1} ${DATE.toLocaleDateString('en-US', { month: 'long' })} ${DATE.getFullYear()}`,
      time:    '15:00',
      ampm:    'P.M.',
      address: 'Via delle Cinque Vie, Chianti, Tuscany, Italy',
      mapsUrl: 'https://maps.google.com/?q=Quinta+Jose+Luis',
    },
  ]

  // ── Dress code ───────────────────────────────────────────────
  export const DRESS_CODE = {
    style: 'Formal / Black Tie',
    hint:  'Look your most elegant',
    /** Colors guests should NOT wear — reserved for the bride */
    reservedColors: [
      { name: 'White',     hex: '#FFFFFF' },
      { name: 'Ivory',     hex: '#FFFFF0' },
      { name: 'Champagne', hex: '#F7E7CE' },
      { name: 'Blush',     hex: '#F4C2C2' },
    ],
  }

  // ── Itinerary ────────────────────────────────────────────────
  export const ITINERARY = [
    { time: '11:00 A.M.', title: 'Religious Ceremony',   desc: 'Cathedral of Santa Maria'        },
    { time: '15:00 P.M.', title: 'Reception & Cocktail', desc: 'Villa La Signoria gardens'       },
    { time: '16:00 P.M.', title: 'Toast & Brindisi',     desc: 'Champagne for the newlyweds'     },
    { time: '17:00 P.M.', title: 'Wedding Dinner',       desc: 'Traditional Tuscan banquet'      },
    { time: '20:00 P.M.', title: 'First Dance',          desc: 'Dance the night away'            },
  ]

  // ── Gift / registry ───────────────────────────────────────────
  export const GIFTS = {
    message: 'Your presence is the greatest gift.\nIf you wish to honour us further,\nhere are our details.',
    bank: [
      { label: 'Bank',           value: 'Banca Toscana'              },
      { label: 'Account Holder', value: 'Sofia Rossi'                },
      { label: 'Account Type',   value: 'Savings Account'            },
      { label: 'IBAN',           value: 'IT60X0542811101000000123456' },
      { label: 'BIC / SWIFT',    value: 'BANCI2T1'                   },
    ],
    envelopeNote: 'A treasure chest will be available at the venue for those who prefer to deliver their gift in person.',
  }

  // ── Gallery placeholder labels ────────────────────────────────
  // Replace gradients with real image URLs once you have photos:
  // e.g. src: '/photos/engagement.jpg'
  export const GALLERY = [
    { id: 0, color1: '#C9A040', color2: '#8B6520', label: 'Engagement' },
    { id: 1, color1: '#B09060', color2: '#7A6040', label: 'Together'   },
    { id: 2, color1: '#D4B880', color2: '#A08040', label: 'Our Story'  },
    { id: 3, color1: '#A09070', color2: '#706050', label: 'In Love'    },
    { id: 4, color1: '#C0A870', color2: '#907840', label: 'Joy'        },
    { id: 5, color1: '#B8A060', color2: '#887030', label: 'Forever'    },
  ]

  // ── Photo upload link ─────────────────────────────────────────
  export const PHOTO_UPLOAD_URL = 'https://forms.gle/your-google-form-id'

  // ── Calendar link ─────────────────────────────────────────────
  // Generate at: https://calendar.google.com/calendar/r/eventedit
  export const CALENDAR_URL =
    `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${COUPLE.bride}+%26+${COUPLE.groom}+Wedding&dates=${WEDDING.dateCalendar}T090000Z/${WEDDING.dateCalendar}T220000Z&details=Join+us+for+our+wedding+celebration!&location=${WEDDING.location}`

  // ── Quote displayed in the hero ───────────────────────────────
  export const HERO_QUOTE = {
    line1: 'If I could choose anyone, I\'d choose you —',
    line2: 'because I\'ve fallen in love with you.',
  }

  // ── Footer tagline ────────────────────────────────────────────
  export const FOOTER_TAGLINE = 'This invitation is exclusively for you.'
