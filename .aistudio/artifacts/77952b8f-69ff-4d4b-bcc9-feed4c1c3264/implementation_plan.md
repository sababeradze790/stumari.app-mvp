# Stumari: UI/UX Elevation Implementation Plan (Revised)

## 1. Executive Summary & Architecture Preservation
Stumari is an established boutique hospitality guest-experience platform built on **React 19 (Vite), Tailwind CSS, Lucide icons, and React Context with LocalStorage caching and optional Firebase integration (Auth & Firestore)**. 

### Architecture & Integrations to Preserve (No Rewrite)
- **Framework & Build**: Vite + React 19 + TypeScript.
- **Routing & Navigation**: Client-side state routing (`currentRoute` in `AppContext.tsx` synced with hash history: `landing`, `guest`, `host`, `preview`, `login`, `signup`, `onboarding`, `terms`, `privacy`, `imprint`).
- **Data & Auth Layer**: `AppContext.tsx` + `firebase.ts` (Firebase Auth with Google & Email/Password, Firestore sync with offline/local fallback). **Supabase is not used in the codebase; the actual backend is Firebase + LocalStorage**, which remains untouched.
- **Confirmed Existing Features**:
  - Multi-language switching (EN, KA, DE, FR, RU, ES, IT, HE, TR, PL, UK) with i18n dictionary.
  - Guest guide: Wi-Fi one-tap copy, QR code modal, check-in/out instructions, house rules, amenities, host emergency contacts, local recommendations filter/tabs, guest request submission, physical stand modal.
  - Host portal: Property selector, tabbed management (Overview, Guide Editor, Guest Requests inbox with triage, Analytics & KPIs, Stand orders), guide content editing.
  - Landing page: Hero with NFC showcase, live interactive demo view, boutique benefits, stand material visualizer, pricing, FAQ.
- **Unverified / Future Capabilities**: Any AI concierge chat, automated external review suppression, or external hardware sync are treated strictly as future opportunities, not implemented in this scope.

---

## 2. Established Stumari Brand Palette & Design System

### Reference Brand Palette
- **Primary Coral**: `#F55A51` (CTA, primary brand accents, active interactive highlights)
- **Muted Slate Blue**: `#748C96` (Secondary navigation, subtle tags, supporting icons, map pins)
- **Golden Yellow**: `#FFC757` (Starred highlights, status badges, warm accents, Wi-Fi badge)
- **Warm Neutral Surfaces**:
  - `#DADADA` & `#E3E3E3` base tones
  - **Light Theme**: Warm linen canvas (`#FBFBF9`), card surfaces (`#FFFFFF` & `#F5F5F3`), warm borders (`#E5E5E0`), text charcoal (`#1A1A1A` and `#4A4A4A`)
  - **Dark Theme**: Deep charcoal canvas (`#141413`), card surfaces (`#1E1E1C`), warm slate borders (`#2D2E2B`), text soft off-white (`#F5F5F3` and `#A0A09C`)
- Contrast ratios verified to meet WCAG AA standards across all text and icon pairs.

### Design Tokens & Typography
- **Display Headings**: Elegant editorial serif (`font-serif`, Cormorant Garamond / Playfair) for boutique identity headlines.
- **Interface & Body**: Clean, readable sans-serif (`font-sans`, Inter / system sans) for clarity at all screen sizes.
- **Zero-Pill Discipline & Card Language**:
  - Replace generic stacked pill badges with structured typographic hierarchy, subtle hairline borders (`border-stone-200 / border-stone-700`), and organic tactile card surfaces.
  - Functional status badges (e.g., "Ready for check-in", "Request pending") are retained with clear semantic icons and readable labels.
  - Consistent border radii (`rounded-xl` for cards, `rounded-lg` for interactive inputs/buttons).
  - Tactile micro-interactions: Smooth subtle hover lifts, active press feedback, and reduced-motion compliance.

---

## 3. Phased Implementation Strategy

### Phase A: Design Tokens & Shared Component Foundation
**Goal**: Update global styles and build shared design system components without breaking any existing page.
- **Exact Files Affected**:
  - `src/index.css`: Define CSS variables for brand colors (`#F55A51`, `#748C96`, `#FFC757`, warm neutrals), editorial typography utilities, and tactile card classes.
  - `src/components/common/Header.tsx`: Refine top demo switcher and navigation to match the warm boutique aesthetic, removing nested button hydration issues and generic pill styling while preserving all route switching and language controls.
  - `src/components/common/LanguageSelector.tsx`: Align theme and language dropdowns with the new warm neutral surface styles.
- **Verification & Tests**:
  - `compile_applet` & `lint_applet` pass with 0 errors.
  - Verify light/dark theme toggle works across all viewports.
  - Verify language switching updates UI text in all 11 languages.

### Phase B: Guest Guide Experience Redesign (Priority 1)
**Goal**: Elevate the guest experience screen first, ensuring frictionless mobile access and immediate utility.
- **Exact Files Affected**:
  - `src/components/guest/GuestGuideSimple.tsx`: Main guest view container.
  - `src/components/guest/ArrivalBoardingPass.tsx`: Tactile guest boarding card with Wi-Fi details, check-in status, and quick host contact.
  - `src/components/guest/MobileBottomDock.tsx`: Floating action dock for mobile guests.
  - `src/components/guest/GuestRequestModal.tsx`: Request submission dialog.
- **Key Enhancements**:
  - Mobile-first hierarchy: Wi-Fi network/password with instantaneous visual copy feedback, door code/access, and check-in timeline front and center.
  - Local recommendation cards styled with warm editorial imagery and muted slate blue tags.
  - Retain all guest request dispatching into host state without altering data contracts.
- **Verification & Tests**:
  - Test on mobile (375px/390px) and desktop (1280px) viewports.
  - Verify Wi-Fi clipboard copy triggers accessible toast/state confirmation.
  - Verify guest request submission flows into `AppContext` state and shows confirmation.

### Phase C: Host Portal Refinement (Priority 2)
**Goal**: Improve operational clarity, information density, and management ergonomics for boutique property hosts.
- **Exact Files Affected**:
  - `src/components/host/HostDashboardSimple.tsx`: Host dashboard layout and tabs.
  - `src/components/host/GuestRequestsInbox.tsx`: Request triage, status updates, and responses.
  - `src/components/host/GuideEditor.tsx` (if present or inside dashboard): In-place guide customization.
- **Key Enhancements**:
  - Clean operational hierarchy for multi-property selection, guide preview, guest requests, and KPIs.
  - High-density, readable typography with tabular numerals for occupancy and check-in metrics.
  - Meaningful status indicators (`Pending`, `In Progress`, `Resolved`) using coral, golden yellow, and slate blue.
- **Verification & Tests**:
  - Verify status transition on guest requests updates local state immediately.
  - Verify guide edits persist through `AppContext` and localStorage.
  - Verify tab navigation between Overview, Requests, Guide, and Settings functions smoothly.

### Phase D: Marketing Landing Page Elevation (Priority 3)
**Goal**: Present Stumari as a top-tier boutique hospitality platform with clear value proposition and tactile physical stand showcases.
- **Exact Files Affected**:
  - `src/components/marketing/LandingPage.tsx`: Marketing page sections, hero, feature cards, and CTA.
  - `src/components/common/PhysicalStandModal.tsx`: Natural wood and laser-engraved NFC stand visualizer.
- **Key Enhancements**:
  - Single, compelling primary call to action leading directly to live demo or host onboarding.
  - Authentic showcases of laser-engraved walnut, oak, and birch NFC stands with tactile material details.
  - Embedded video / motion demo with ambient playback controls and responsive scaling.
  - Elimination of generic pill clusters in favor of editorial typography and boutique layout composition.
- **Verification & Tests**:
  - Verify primary CTA routes to `guest` demo or `signup` without page reloads.
  - Verify physical stand modal opens with accurate wood finish selections.
  - Check full responsive layout across mobile, tablet, and desktop breakpoints.

### Phase E: Cross-Route Regression & Accessibility Audit
**Goal**: Full verification of the entire application across all routes.
- **Exact Files Affected**:
  - `src/App.tsx`: Route synchronizer and modal wrappers.
- **Verification & Tests**:
  - Test all routes: `landing`, `guest`, `host`, `preview`, `login`, `signup`, `onboarding`, `terms`, `privacy`, `imprint`.
  - Validate zero hydration errors (no `<button>` inside `<button>`, no mismatched tags).
  - Run `compile_applet` and `lint_applet` to confirm clean build.
