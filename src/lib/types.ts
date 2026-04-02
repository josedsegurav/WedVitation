// lib/types.ts
// ── Shared types for wedding data fetched from the database ───
// Mirrors the shape returned by get_wedding_data_by_token() RPC.
// No 'use client' — safe to import anywhere.

export type WeddingRow = {
    id:               string
    bride_name:       string
    groom_name:       string
    couple_names:     string
    monogram:         string
    seal_initial:     string
    wedding_date:     string   // ISO timestamptz string
    date_display:     string   // e.g. "15 June 2026"
    date_medallion:   string   // e.g. "15 June · 2026"
    location:         string   // ceremony venue name
    rsvp_deadline:    string   // human-readable, e.g. "May 31, 2026"
    hero_quote_line1: string
    hero_quote_line2: string
    footer_tagline:   string
    photo_upload_url: string
    calendar_url:     string
    wa_template:      string
    venue_label:      string
    theme_id:         string
  }

  export type EventRow = {
    type:       'ceremony' | 'reception'
    venue:      string
    event_date: string
    event_time: string
    ampm:       string
    address:    string
    maps_url:   string
  }

  export type FamilyRow = {
    label:       string
    family_name: string
    parents:     string
  }

  export type DressCodeColor = {
    name: string
    hex:  string
  }

  export type DressCodeData = {
    style:            string
    hint:             string
    reserved_colors:  DressCodeColor[] | null
  }

  export type ItineraryItem = {
    time_label:  string
    title:       string
    description: string
  }

  export type GiftBankRow = {
    label: string
    value: string
  }

  export type GiftsData = {
    message:       string
    envelope_note: string
    bank:          GiftBankRow[] | null
  }

  export type GalleryPhoto = {
    id:    string
    label: string
    src:   string
    alt:   string
  }

  // ── The full payload returned by get_wedding_data_by_token ────
  export type WeddingData = {
    wedding:    WeddingRow
    events:     EventRow[]
    families:   FamilyRow[]
    dress_code: DressCodeData | null
    itinerary:  ItineraryItem[]
    gifts:      GiftsData | null
    gallery:    GalleryPhoto[]
  }