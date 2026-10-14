# Implementation Plan: Editorial Luxury Landing Page Redesign

Transform the Stumari landing page from a cluttered high-tech interface into a **warm editorial luxury experience** inspired by boutique hospitality publications (Kinfolk, Aman, Airbnb Luxe, Monocle). The redesign emphasizes spacious card geometry, refined serif typography, tactile neutral palettes, zero visual clutter, and an interactive split hero with a live guest guide simulation.

---

## 1. Aesthetic Direction & Design System Upgrades

### Color Palette (Warm Tactile Neutrals)
- **Backgrounds**: Soft parchment and warm linen (`#FAF8F5`, `#F5F2EB`, dark mode `#141312` and `#1C1917`).
- **Surfaces & Cards**: Crisp warm bone white (`#FFFFFF`), light sand borders (`#EAE5DC`, `border-stone-200/80`), and subtle warm card shadows (`shadow-[0_8px_30px_rgb(28,25,23,0.06)]`).
- **Accents**: Deep espresso (`#1C1917`), warm terracotta / aged cognac (`#B45309`, `#9A3412`), and muted sage (`#0F766E` / `#047857`).
- **Dark Mode Support**: Deep charcoal obsidian (`#141312`, `#1F1E1B`) with warm metallic highlights and quiet dividers.

### Typography & Anti-Slop Discipline
- **Headlines**: Elegant serif hierarchy (`font-serif`, `tracking-tight`, refined letterforms) paired with clean geometric grotesque sans for body copy.
- **Zero-Pill Compliance**: Remove all static capsule pill badges. Statuses, categories, and tags will render as quiet, unboxed typographic metadata with refined dot separators (`·`).
- **Generous Spatial Rhythm**: Generous padding (`p-6` to `p-10`), quiet architectural dividers, and structured card layouts with maximum readability.

---

## 2. Page Architecture & Section Breakdown

### Section 1: Split Luxury Hero
- **Left Column**:
  - High-impact editorial headline: *"The Guest Experience Your Property Deserves."*
  - Seductive 2-line value proposition highlighting instant 1-tap Wi-Fi, midnight check-in self-service, and zero app downloads.
  - Primary CTA button (*"Explore Live Guide"*) + Secondary link (*"Generate Host QR Stand"*).
  - Quiet social proof: *"Trusted by 2,400+ boutique hosts & villas across Europe & Georgia"*.
- **Right Column (Interactive Smartphone Guide)**:
  - Polished phone frame with realistic hardware bezels and notch.
  - Interactive live preview: guests can tap to reveal door lock codes, copy Wi-Fi with 1 click, browse host house rules, and view neighborhood hidden gems.
  - Real-time feedback animations with smooth Framer Motion pop-in transitions.

### Section 2: Architectural Proof & Narrative Metric Strip
- Quiet, borderless editorial stat block replacing bulky badge cards:
  - **< 15 seconds**: Average guest check-in time without host messaging.
  - **98.4%**: Reduction in midnight lockbox & Wi-Fi calls.
  - **4.97 / 5.0**: Average guest review rating across properties with Stumari stands.
  - **0 apps**: Zero download barrier for international guests.

### Section 3: Interactive Guide Showcase & Property Switcher
- Curated property preview switcher (e.g., *Old Tbilisi Heritage Loft*, *Kazbegi Mountain Chalet*, *Vake Design Apartment*).
- Redesigned spacious guest cards:
  - **Arrival & Keypad**: Clean tactile card with copyable door codes and visual entry instructions.
  - **High-Speed Wi-Fi**: Instant 1-tap copy with QR connection visual.
  - **House Curiosities & Rules**: Clear, respectful house guidelines with Georgian architectural line sketches.
  - **Curated Neighborhood Gems**: Hand-picked local cafes, bakeries, wine cellars, and taxi tips.

### Section 4: The Physical Touchpoint (The QR Table Stand)
- Elegant showcase of the physical guest touchpoint: the acrylic & solid walnut bedside stand.
- Visual demonstration of how guests tap NFC or scan the QR code upon entering the room.
- Interactive modal / drawer to preview printable stands and PDF export for hosts.

### Section 5: "Before & After" Host Sanity Comparison
- Re-architected as a clean 2-column comparative table/card layout:
  - *The Old Way*: Messy PDF manuals, lost WhatsApp messages, late-night panicked calls about water heaters.
  - *The Stumari Way*: One elegant link on the guest's phone, updated in real time by the host in seconds.

### Section 6: Editorial Host Testimonials & Final Invitation CTA
- Clean quote blocks from superhosts with verified property locations.
- Seductive final conversion section with a direct, warm call to action: *"Give your next guest an unforgettable welcome."*

---

## 3. Implementation Steps & File Verification

1. **Update Design Tokens & Helpers**: Ensure typography, warm tones, and card shadow utilities are available in `index.css`.
2. **Refactor `LandingPage.tsx`**: Replace the current crowded layout with the new modular, editorial sections while retaining full multi-language (`t`) and theme support.
3. **Interactive Phone Component**: Create an interactive, tactile phone mockup showcasing real guest interactions directly within the hero.
4. **Compile & Lint**: Execute `lint_applet` and `compile_applet` to ensure zero compilation or styling regressions.
