Here is your complete, high-quality Figma design prompt for the Virtual Business Development Partner (VBDP) platform:

SECTION 1 — FIGMA PROMPT

🧠 PROJECT OVERVIEW
Project Name: VBDP — Virtual Business Development Partner
Tagline: "AI-Powered Tender Intelligence for India's MSMEs"
Platform: Web Application (Landing Page — 4 Sections: Home, About, Contact, Login)
Target Users: Indian MSME owners, procurement managers, and SME decision-makers aged 28–55, semi-tech-savvy, mobile-first but desktop-oriented for business tasks.

🎯 DESIGN PHILOSOPHY

Style: Futuristic Enterprise Minimalism — dark-dominant, data-dense yet breathable
Mood: Intelligent, trustworthy, powerful, and approachable
Aesthetic Direction: Deep space navy + electric teal + gold accent — think Bloomberg Terminal meets Linear.app
Character: Every element feels like it was built inside a war room — precise, sharp, purposeful


🎨 COLOR PALETTE & GRADIENTS
── Design Tokens ──────────────────────────────────────────

Background Primary:     #050D1A  (Deep space black-navy)
Background Secondary:   #0A1628  (Card/panel surface)
Background Tertiary:    #0F1E35  (Elevated surface)

Brand Teal:             #00C2A8  (Primary CTA, active states)
Brand Electric Blue:    #0078FF  (Secondary highlight)
Brand Gold:             #F5A623  (Premium badge, alerts)

Text Primary:           #F0F4FF  (Headlines)
Text Secondary:         #8A9BB8  (Body, captions)
Text Muted:             #3D5070  (Disabled, hints)

Border Default:         rgba(255,255,255,0.06)
Border Active:          rgba(0,194,168,0.4)

── Gradients ──────────────────────────────────────────────

Hero Gradient:          linear-gradient(135deg, #050D1A 0%, #0A1E3D 60%, #001A2E 100%)
CTA Button Gradient:    linear-gradient(90deg, #00C2A8 0%, #0078FF 100%)
Card Shimmer Gradient:  linear-gradient(135deg, rgba(0,194,168,0.08) 0%, rgba(0,120,255,0.04) 100%)
Glow Overlay:           radial-gradient(ellipse at 60% 40%, rgba(0,194,168,0.12) 0%, transparent 70%)
Gold Accent Gradient:   linear-gradient(90deg, #F5A623 0%, #FFD580 100%)
Glass Surface:          rgba(10,22,40,0.7) + backdrop-blur: 16px

🔤 TYPOGRAPHY SYSTEM
── Font Families ──────────────────────────────────────────

Display Font:     "Syne" — Bold 700/800 for hero headlines
                  Use for: H1, H2, navigation brand name

Body Font:        "DM Sans" — Regular 400, Medium 500
                  Use for: paragraphs, descriptions, form labels

Mono Accent:      "JetBrains Mono" — Regular 400
                  Use for: stats counters, API labels, code snippets

── Type Scale ─────────────────────────────────────────────

H1 Hero:          72px / Syne 800 / Line-height 1.1 / Letter-spacing -2px
H2 Section:       48px / Syne 700 / Line-height 1.2 / Letter-spacing -1px
H3 Card Title:    28px / Syne 600 / Line-height 1.3
Body Large:       18px / DM Sans 400 / Line-height 1.7
Body Default:     16px / DM Sans 400 / Line-height 1.6
Caption:          13px / DM Sans 500 / Letter-spacing 0.8px / Uppercase
Stat Number:      56px / JetBrains Mono 700 / Brand Teal

📐 LAYOUT STRUCTURE
── Grid System ────────────────────────────────────────────

Desktop (1440px):   12-column grid / Gutter: 32px / Margin: 80px
Tablet (768px):     8-column grid  / Gutter: 24px / Margin: 40px
Mobile (375px):     4-column grid  / Gutter: 16px / Margin: 20px

── Section Heights ────────────────────────────────────────

Navbar:             72px fixed / Frosted glass background
Hero Section:       100vh / Full bleed with animated mesh background
About Section:      min-height 900px / Agent architecture visualization
Contact Section:    min-height 700px / Split layout
Login Section:      Full-screen modal overlay / Centered card
Footer:             240px / Dark panel with links + stats

── Spacing Tokens ─────────────────────────────────────────

space-xs:    4px
space-sm:    8px
space-md:    16px
space-lg:    24px
space-xl:    40px
space-2xl:   64px
space-3xl:   96px
space-4xl:   128px

── Border Radius ──────────────────────────────────────────

radius-sm:   6px   (tags, badges)
radius-md:   12px  (inputs, small cards)
radius-lg:   20px  (cards, panels)
radius-xl:   32px  (modals, feature blocks)
radius-pill: 999px (buttons, chips)

🖥️ PAGE SECTIONS — DETAILED LAYOUT

SECTION: HOME (Hero)
Layout: Full-viewport hero with fixed navbar overlay
Navbar:

Left: VBDP logo — geometric hexagon icon + "VBDP" in Syne Bold
Center: Navigation links — Home | About | Contact | Login (spaced 48px apart)
Right: "Get Early Access" pill CTA button in teal-to-blue gradient
Background: rgba(5,13,26,0.8) + backdrop-filter: blur(20px) + bottom border rgba(255,255,255,0.05)
Sticky on scroll with a smooth fade-in shadow

Hero Content (Left-aligned, vertically centered):

Eyebrow tag: [ AI-POWERED · IBM GRANITE LLM ] — monospace font, teal border chip
H1 Headline (2-line):
"Win More Tenders.
Automatically."
— White, 72px Syne 800, with "Automatically." in teal gradient text
Subheadline: 18px DM Sans, muted, 2 lines max — describing MSME automation
CTA Row: Primary button "Start for Free →" (gradient pill) + Ghost button "Watch Demo ▷" with subtle border
Trust badges row below CTA: 3 small chips — "500+ Portals Monitored", "85%+ Match Accuracy", "ISO Compliant"

Hero Right Side (Floating UI Preview):

Floating glassmorphic dashboard card (rotated 6° on Y-axis, perspective tilt)
Shows a mini "Tender Match Feed" — 3 stacked rows with progress bars and match % badges
Subtle teal glow behind the card

Hero Background:

Animated mesh gradient (slow-moving noise field)
Radial glow positioned at top-right
Faint hexagonal grid pattern overlay at 4% opacity
Floating orbs: 2–3 blurred teal/blue ellipses slowly drifting


SECTION: ABOUT
Layout: Full section, 2 subsections
Subsection A — The Problem:

Section label: [ PROBLEM STATEMENT ] monospace chip, left-aligned
H2: "6.3 Crore MSMEs. One Broken System."
3-column stat strip (below H2):

500+ Fragmented Portals
80% Manual Effort Wasted
50% Faster Response with VBDP
— Each stat in JetBrains Mono 56px teal, label in DM Sans below



Subsection B — The Architecture (Multi-Agent Diagram):

Visual: Centered node diagram showing the CEO Agent in the middle (glowing hexagon), connected by animated dashed lines to 4 outer agent cards:

🔍 Discovery Agent
🛡️ Security Agent
📊 Analysis Agent
✍️ Response Agent


Each outer card: glassmorphic panel with icon, name, and 1-line function
Animated connecting lines pulse on hover
Background: subtle blueprint/circuit grid pattern at low opacity


SECTION: CONTACT
Layout: 60/40 horizontal split
Left Panel:

H2: "Let's Build Together."
Body paragraph about partnership, enterprise demos
3 contact detail rows with icons: Email | LinkedIn | Location (India)
Decorative: animated floating card showing "Your Message Delivered" with a teal checkmark (parallax float)

Right Panel (Form):

Glassmorphic card radius-xl, soft inner shadow
Fields: Full Name | Business Email | Company/MSME Name | Message (textarea)
All fields: dark input style, teal focus ring glow, floating label animation
Submit CTA: Full-width gradient button "Send Message →"
Below form: "No spam. Ever. 🔒" caption in muted text


SECTION: LOGIN
Trigger: Clicking "Login" opens a full-screen modal overlay (not a page scroll)
Modal Design:

Backdrop: blurred background backdrop-filter: blur(24px) + dark overlay rgba(5,13,26,0.85)
Centered card: 480px wide glassmorphic panel, radius-xl
Top: VBDP logo + "Welcome Back" headline
Tab switcher: "Login" | "Register" — pill-style switcher
Login Fields: Email + Password with show/hide toggle
CTA: "Login to Dashboard →" full gradient button
Divider: "or continue with"
OAuth buttons: Google | LinkedIn — outlined ghost buttons
Footer link: "Forgot Password?" in teal


SECTION 2 — SUGGESTED UI COMPONENTS
01. Navbar Component
    — Logo, NavLinks, CTA Button, Frosted Glass Background
    — Active link: teal underline with fade-in transition
    — Mobile: Hamburger menu → slide-in drawer

02. Hero Badge/Eyebrow Chip
    — Monospace text, teal dashed border, 6px radius, 8px padding

03. Gradient CTA Button
    — States: Default | Hover (scale 1.02 + shadow) | Active (scale 0.98) | Loading (shimmer)
    — Framer Motion: spring transition on tap

04. Glassmorphic Card
    — rgba background, backdrop-blur 16px, thin border rgba(255,255,255,0.06)
    — Hover: border brightens to rgba(0,194,168,0.3), soft glow

05. Agent Node Card (About Section)
    — Hexagonal icon frame, gradient inner glow
    — Animated connecting SVG lines between nodes

06. Stat Counter Block
    — JetBrains Mono number in teal
    — Count-up animation on scroll-enter

07. Tender Feed Card (Hero preview)
    — Match percentage badge (green/yellow/red)
    — Progress bar with shimmer animation
    — Source logo placeholder

08. Form Input Field
    — Dark fill, floating label, teal focus glow border
    — Error state: red-600 bottom border + shake micro-animation

09. Login Modal
    — Tab switcher (pill style), OAuth buttons, input fields

10. Footer
    — 4-column grid: Logo+tagline | Links | Social | Status badge
    — "All Systems Operational" green pulse indicator

11. Toast Notification
    — Bottom-right slide-in, auto-dismiss, teal success / red error

12. Section Divider
    — Subtle gradient line `rgba(0,194,168,0.2)` with center glow

SECTION 3 — ANIMATION & INTERACTION DETAILS
Framer Motion Specifications
── Page Load (Hero) ─────────────────────────────────────

1. Navbar slides down from y:-60 → y:0, opacity 0→1
   Duration: 0.5s, ease: easeOut, delay: 0.1s

2. Hero eyebrow chip fades in: opacity 0→1, y:20→0
   Duration: 0.6s, ease: easeOut, delay: 0.3s

3. H1 headline — word-by-word stagger reveal
   Each word: y:40→0, opacity 0→1
   Stagger: 0.08s per word, ease: circOut

4. Subheadline fade-up: y:20→0, opacity 0→1
   Delay: 0.8s, duration: 0.5s

5. CTA buttons scale in: scale 0.9→1, opacity 0→1
   Delay: 1.0s, spring: { stiffness: 300, damping: 25 }

6. Hero card floats in from right: x:80→0, opacity 0→1
   Delay: 1.2s, duration: 0.8s, ease: easeOut
   Then: continuous float loop y:0→-12px, duration: 4s, yoyo

── Scroll-Triggered Animations ─────────────────────────

7. Stat counters: count up from 0 when scrolled into view
   Duration: 2s, ease: easeOut

8. Agent node diagram: nodes fade in one-by-one
   Stagger: 0.15s, then connecting lines draw themselves (SVG stroke-dashoffset)

9. About section cards: staggered slide-up
   y:40→0, opacity 0→1, stagger: 0.1s

10. Contact form slides in from right: x:60→0, opacity 0→1

── Hover States ─────────────────────────────────────────

11. CTA Button hover:
    scale: 1.02
    box-shadow: 0 0 32px rgba(0,194,168,0.4)
    Gradient shifts +10deg hue
    Duration: 0.2s

12. Glassmorphic card hover:
    border-color: rgba(0,194,168,0.35)
    y: -4px (lift effect)
    box-shadow: 0 16px 48px rgba(0,0,0,0.4)
    Duration: 0.25s, ease: easeOut

13. Nav link hover:
    Teal underline scales from scaleX:0 → scaleX:1
    Origin: left
    Duration: 0.2s

14. Agent node hover:
    Ring pulse animation (scale 1→1.15→1, opacity 1→0)
    Background brightens slightly

── Modal (Login) Transitions ────────────────────────────

15. Overlay open:
    Backdrop: opacity 0→1, duration: 0.3s
    Card: scale 0.9→1, y:20→0, opacity 0→1
    Spring: { stiffness: 350, damping: 28 }

16. Modal close:
    scale 1→0.95, opacity 1→0, duration: 0.2s

17. Tab switch (Login ↔ Register):
    Content: x:20→0 (slide), opacity 0→1
    Duration: 0.25s, AnimatePresence with exitBeforeEnter

── Ambient / Background Animations ─────────────────────

18. Hero mesh gradient: slow morph every 8s, CSS keyframes
19. Floating orbs: y-axis drift, 6–10s loop, ease: sinusoidal
20. Hexagonal grid: very slow rotation 0→360 over 120s
21. Agent connector lines: pulse opacity 0.3→1 in sequence, 2s loop

SECTION 4 — VISUAL STYLE
Shadows
shadow-sm:   0 2px 8px rgba(0,0,0,0.3)
shadow-md:   0 8px 24px rgba(0,0,0,0.4)
shadow-lg:   0 16px 48px rgba(0,0,0,0.5)
shadow-glow-teal:  0 0 32px rgba(0,194,168,0.35)
shadow-glow-blue:  0 0 24px rgba(0,120,255,0.3)
shadow-glow-gold:  0 0 20px rgba(245,166,35,0.4)
shadow-inner-card: inset 0 1px 0 rgba(255,255,255,0.05)
Glassmorphism Recipe
background:       rgba(10, 22, 40, 0.65)
backdrop-filter:  blur(16px) saturate(1.4)
border:           1px solid rgba(255, 255, 255, 0.06)
border-radius:    20px
box-shadow:       0 8px 32px rgba(0, 0, 0, 0.4),
                  inset 0 1px 0 rgba(255, 255, 255, 0.05)
Gradient Text (Hero Headline)
background: linear-gradient(90deg, #00C2A8 0%, #0078FF 100%)
-webkit-background-clip: text
-webkit-text-fill-color: transparent
Decorative Patterns
- Hexagonal grid SVG at opacity: 0.04, color: #00C2A8
- Noise texture overlay at opacity: 0.03 (CSS grain filter)
- Blueprint circuit lines in About section at opacity: 0.06
- Radial glow spots: 2–3 per section, color teal/blue, opacity 0.10–0.15
Responsive Behavior
Desktop 1440px:
  - Full 12-col layout, hero split 50/50, agent diagram full-width

Tablet 768–1024px:
  - Hero stacks vertically (text top, card bottom)
  - About stats become 1-row scroll
  - Agent diagram compresses to 2×2 grid
  - Contact splits to single column

Mobile 375–767px:
  - Full single-column layout
  - Navbar collapses to hamburger drawer (slide from right)
  - Hero card hidden on mobile < 480px
  - CTA buttons full-width
  - Agent cards stack vertically with horizontal scroll
  - Login modal becomes full-screen bottom sheet
  - Font sizes scale down: H1 → 42px, H2 → 32px