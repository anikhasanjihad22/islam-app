---
name: Sacred Serenity
colors:
  surface: '#071610'
  surface-dim: '#071610'
  surface-bright: '#2c3d36'
  surface-container-lowest: '#03110b'
  surface-container-low: '#0f1f18'
  surface-container: '#13231c'
  surface-container-high: '#1d2d27'
  surface-container-highest: '#283831'
  on-surface: '#d4e7dd'
  on-surface-variant: '#bbcabf'
  inverse-surface: '#d4e7dd'
  inverse-on-surface: '#24342d'
  outline: '#86948a'
  outline-variant: '#3c4a42'
  surface-tint: '#4edea3'
  primary: '#4edea3'
  on-primary: '#003824'
  primary-container: '#10b981'
  on-primary-container: '#00422b'
  inverse-primary: '#006c49'
  secondary: '#e9c349'
  on-secondary: '#3c2f00'
  secondary-container: '#af8d11'
  on-secondary-container: '#342800'
  tertiary: '#95d3ba'
  on-tertiary: '#003829'
  tertiary-container: '#71af97'
  on-tertiary-container: '#004231'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#6ffbbe'
  primary-fixed-dim: '#4edea3'
  on-primary-fixed: '#002113'
  on-primary-fixed-variant: '#005236'
  secondary-fixed: '#ffe088'
  secondary-fixed-dim: '#e9c349'
  on-secondary-fixed: '#241a00'
  on-secondary-fixed-variant: '#574500'
  tertiary-fixed: '#b0f0d6'
  tertiary-fixed-dim: '#95d3ba'
  on-tertiary-fixed: '#002117'
  on-tertiary-fixed-variant: '#0b513d'
  background: '#071610'
  on-background: '#d4e7dd'
  surface-variant: '#283831'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
  arabic-quran:
    fontFamily: Noto Serif
    fontSize: 28px
    fontWeight: '400'
    lineHeight: 56px
  display-lg-mobile:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 16px
  margin-mobile: 20px
  margin-desktop: 40px
---

## Brand & Style
The design system is rooted in a philosophy of "Peace through Precision." It targets a global audience seeking a premium, spiritual digital environment that honors Islamic tradition through modern design principles. 

The aesthetic is **Corporate Modern with a Minimalist/Glassmorphic edge**. It avoids excessive ornamentation in favor of generous whitespace, sophisticated typography, and subtle tactile depths. The interface must feel intentional and calm, reducing cognitive load to allow the user to focus on prayer, study, and reflection. High-quality execution is achieved through a strict 8px grid and a restrained use of metallic gold accents to signify importance without appearing ostentatious.

## Colors
The color palette is split between a "Deep Night" dark mode and a "Warm Parchment" light mode. 

**Dark Mode (Default):** Use `#0A1A14` as the base surface. Primary actions use Emerald `#10B981`. Gold `#D4AF37` is reserved exclusively for "Divine" elements: prayer times, Qibla indicators, or highlighted Quranic verses.
**Light Mode:** Use `#FAF9F6` to evoke the feeling of high-quality paper. The primary color shifts to the deeper `#064E3B` for better legibility against the light background.

Apply colors using a 60-30-10 ratio to maintain visual hierarchy. Semantic colors (Success, Error, Warning) should be used with reduced saturation in dark mode to prevent visual vibration.

## Typography
Typography is the primary vehicle for the sacred text. 
- **UI Text:** Use **Inter** for all functional labels, settings, and descriptions. It provides a neutral, systematic counterpoint to the decorative nature of script.
- **Scriptural Text:** Use a high-contrast serif like **Noto Serif** (as a proxy for Amiri/Scheherazade in system tokens) for Arabic text. Ensure line-height for Arabic is at least 2x the font size to accommodate diacritics (Tashkeel) without clipping.
- **Multilingual Support:** Integrate **Hind Siliguri** for Bengali, ensuring its x-height aligns visually with Inter by slightly adjusting the scale (usually 110% of the Latin font size).

## Layout & Spacing
This design system utilizes a **Fluid Grid** with an **8px base unit**. 
- **Mobile:** 4-column grid with 20px side margins and 16px gutters.
- **Desktop:** 12-column centered grid with a maximum content width of 1140px.

All component dimensions and internal padding must be multiples of 8px. Use 16px (md) for standard internal card padding and 24px (lg) for vertical section spacing to maintain a sense of openness and breathability.

## Elevation & Depth
Depth is created through **restrained glassmorphism** and **tonal layering** rather than heavy shadows.
- **Surface Level 0:** Background color (#0A1A14).
- **Surface Level 1 (Cards):** Background with 5% white overlay or a subtle 1px border (#FFFFFF10).
- **Glassmorphism:** Use for persistent elements like the Bottom Navigation Bar and Top App Bar. Apply a 20px backdrop blur with a 60% opacity fill of the background color.
- **Shadows:** Use only one "Ambient" shadow for floating action buttons or active cards: `0px 12px 32px rgba(0, 0, 0, 0.4)`. 
- **Overlays:** Use a subtle gold-tinted inner glow (1px) for primary active states to simulate a premium "metallic" edge.

## Shapes
The shape language is "Softly Geometric."
- **Standard Radius:** 12px for small components (inputs, small cards).
- **Large Radius:** 16px for main containers and feature cards.
- **Pill:** Reserved for status chips and tags.

Avoid sharp 0px corners to maintain the "Peaceful" brand pillar. The 12px-16px range provides a modern, high-end mobile feel that feels comfortable in the hand.

## Components
- **Cards:** Use a 1px stroke (#FFFFFF15 in dark, #00000010 in light) instead of heavy shadows. For featured content (e.g., "Verse of the Day"), use a subtle gradient background: `linear-gradient(135deg, #064E3B 0%, #0A1A14 100%)`.
- **Bottom Navigation:** Fixed glassmorphic bar. Active icons should use the Gold accent (#D4AF37) with a tiny 4px dot indicator underneath.
- **Buttons:** 
  - *Primary:* Solid Emerald with white text. 
  - *Secondary:* Transparent with 1px Emerald stroke.
  - *Tertiary:* Ghost style with Gold text for specific religious actions.
- **Inputs:** Understated borders, 12px radius. Focus state uses a 2px Emerald border with a subtle outer glow.
- **Skeleton Loaders:** Use a shimmering gradient moving from `#11221C` to `#1A2E26` for dark mode to ensure the "wait" state feels premium and intentional.
- **Prayer Time Row:** A specialized list item with a horizontal layout, using high-contrast typography for the time and a "Next Prayer" indicator using the Gold accent.