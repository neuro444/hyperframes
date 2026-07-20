---
name: Culinary Connect
colors:
  surface: "#fbf9f9"
  surface-dim: "#dbdad9"
  surface-bright: "#fbf9f9"
  surface-container-lowest: "#ffffff"
  surface-container-low: "#f5f3f3"
  surface-container: "#efeded"
  surface-container-high: "#e9e8e7"
  surface-container-highest: "#e3e2e2"
  on-surface: "#1b1c1c"
  on-surface-variant: "#5b4040"
  inverse-surface: "#303031"
  inverse-on-surface: "#f2f0f0"
  outline: "#8f6f6f"
  outline-variant: "#e3bebd"
  surface-tint: "#ba1434"
  primary: "#9e0027"
  on-primary: "#ffffff"
  primary-container: "#c41e3a"
  on-primary-container: "#ffdada"
  inverse-primary: "#ffb3b4"
  secondary: "#5f5e5e"
  on-secondary: "#ffffff"
  secondary-container: "#e2dfde"
  on-secondary-container: "#636262"
  tertiary: "#4e4d4b"
  on-tertiary: "#ffffff"
  tertiary-container: "#666563"
  on-tertiary-container: "#e6e3e0"
  error: "#ba1a1a"
  on-error: "#ffffff"
  error-container: "#ffdad6"
  on-error-container: "#93000a"
  primary-fixed: "#ffdad9"
  primary-fixed-dim: "#ffb3b4"
  on-primary-fixed: "#40000a"
  on-primary-fixed-variant: "#920023"
  secondary-fixed: "#e5e2e1"
  secondary-fixed-dim: "#c8c6c5"
  on-secondary-fixed: "#1c1b1b"
  on-secondary-fixed-variant: "#474746"
  tertiary-fixed: "#e5e2df"
  tertiary-fixed-dim: "#c8c6c3"
  on-tertiary-fixed: "#1c1c1a"
  on-tertiary-fixed-variant: "#474745"
  background: "#fbf9f9"
  on-background: "#1b1c1c"
  surface-variant: "#e3e2e2"
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: "700"
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: "600"
    lineHeight: 32px
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: "600"
    lineHeight: 28px
  body-lg:
    fontFamily: Work Sans
    fontSize: 16px
    fontWeight: "400"
    lineHeight: 24px
  body-md:
    fontFamily: Work Sans
    fontSize: 14px
    fontWeight: "400"
    lineHeight: 20px
  label-md:
    fontFamily: Work Sans
    fontSize: 12px
    fontWeight: "500"
    lineHeight: 16px
    letterSpacing: 0.05em
  display-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: "700"
    lineHeight: 36px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  margin-mobile: 16px
  gutter-mobile: 12px
---

## Brand & Style

The design system is built for a mobile-first social experience that bridges the gap between casual chat and fine dining. Drawing inspiration from the "Kerala Restaurant & Cafe" visual identity, the brand personality is **warm, inviting, and premium**. It avoids the sterility of typical utility apps in favor of a "modern bistro" aesthetic.

The visual style is **Corporate Modern with Tactile accents**. It utilizes clean, high-contrast layouts to ensure legibility in fast-paced environments (like a busy restaurant) while employing soft shadows and deep color accents to create a sense of physical comfort. The target audience includes food enthusiasts, social diners, and hospitality professionals who value both efficiency and atmosphere.

## Colors

The palette is rooted in the rich, appetizing tones of the culinary world.

- **Primary (Deep Red):** Used for key actions, brand moments, and notifications. This specific shade is chosen to stimulate appetite and convey energy.
- **Secondary (Onyx Black):** Used for primary text and high-contrast UI elements like headers and navigation bars to provide a sophisticated anchor.
- **Tertiary (Bone White):** A slightly warm off-white used for page backgrounds to reduce eye strain and feel more organic than pure #FFFFFF.
- **Neutral (Slate Gray):** Used for secondary text, borders, and inactive states.

For chat bubbles, use the Primary color for the user's messages (white text) and a light gray for received messages (black text) to maintain a clear visual hierarchy.

## Typography

This design system pairs **Plus Jakarta Sans** for headlines with **Work Sans** for body copy.

Plus Jakarta Sans provides a friendly, contemporary geometric touch that feels welcoming. Work Sans is used for technical and long-form content because of its exceptional legibility and professional, grounded feel.

Use **display-lg** for onboarding and featured headers. For chat interfaces, **body-lg** is the standard for message bubbles to ensure high readability on mobile devices. **Label-md** should be used in all-caps for category headers or timestamps to provide a distinct stylistic break from conversational text.

## Layout & Spacing

The design system utilizes a **fluid grid** with a focus on mobile ergonomics.

- **Mobile:** 4-column grid with 16px side margins and 12px gutters.
- **Tablet/Desktop:** 12-column grid with a max-width of 1040px for content containers.

The spacing rhythm is based on a **4px baseline**. Most component padding should default to `md` (16px) to maintain a "breathable" feel that aligns with modern, clean aesthetics. For dense information like contact lists, the spacing can be reduced to `sm` (8px) vertically.

## Elevation & Depth

Hierarchy is established through **Tonal Layers** and **Ambient Shadows**.

- **Level 0 (Base):** Tertiary (off-white) background.
- **Level 1 (Cards/Bubbles):** Pure white surfaces with a very soft, diffused shadow (0px 4px 20px rgba(0,0,0,0.05)).
- **Level 2 (Floating Actions/Modals):** Pure white surfaces with a more pronounced shadow (0px 8px 30px rgba(0,0,0,0.12)).

Avoid heavy borders; instead, use subtle 1px strokes in a light neutral color (#E0E0E0) only when elements overlap on similar colors. In the chat view, the input area should be pinned to the bottom with a subtle Level 1 elevation to separate it from the scrolling message stream.

## Shapes

The shape language is **Rounded**, reflecting the friendly and approachable brand personality.

- **Standard (0.5rem):** Used for message bubbles, input fields, and small cards.
- **Large (1rem):** Used for primary containers, modals, and bottom sheets.
- **Full (Pill):** Used for buttons and status chips (e.g., "Online", "Table Ready").

Message bubbles should have a specific logic: 0.5rem on all corners except the one pointing to the sender (which remains sharp) to clearly indicate directionality.

## Components

### Buttons

Primary buttons use the Deep Red background with White text, using a pill-shape (rounded-full). Secondary buttons use an Onyx Black outline with matching text for a sophisticated look.

### Chat Bubbles

User bubbles: Deep Red background, White text, right-aligned.
Recipient bubbles: Light Gray background, Black text, left-aligned.
Include a small timestamp in Label-md font-size at the bottom right of each bubble.

### Input Fields

Search bars and chat inputs use a Pure White background with a 1px Light Gray border. Use the "Rounded" (0.5rem) setting. Icons within inputs should be Onyx Black at 60% opacity.

### Chips & Tags

Used for "Cuisine Type" or "Dietary Prefs." These should be small, pill-shaped, using a 10% opacity version of the Primary Red with the full-strength Red for text to create a soft, integrated appearance.

### Navigation

The mobile bottom navigation bar should be Level 2 elevation, using Onyx Black for the active icon and Slate Gray for inactive states. Use simple, stroke-based icons for a modern feel.
