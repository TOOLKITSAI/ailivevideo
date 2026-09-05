# Design — AI Live Video

Approved direction: dark technology directory.

## Genre
Atmospheric, restrained Midnight treatment with existing brand violet. Function and discovery take precedence over decorative atmosphere.

## Macrostructure family
Home: Ecosystem Index, category rail and screenshot-led discovery. Directory/category: filterable index. Tool detail and articles: Long Document, readable measure and open sections. Utility pages: compact document.

## Typography
Space Grotesk Variable for roman headings; Inter Variable for body. Both self-hosted Latin subsets.

## Theme and spacing
Canonical tokens live in tokens.css. Dark graphite paper; light ink; violet for links, controls, focus. Named 4-point spacing scale. No gradients, fake UI chrome or decorative icons.

## Navigation and footer
Compact index navigation with direct tool, category, guide and about destinations. Ft4 dense typographic colophon. Keep existing logo and all legal destinations.

## Motion and state
No reveal animation. Instant focus; pressed 1px translation; reduced-motion support. Search and filters retain their existing state and error handling.

## Content and images
Never invent claims or counts. Home counts derive from content. Official screenshots retain provenance on detail pages. Existing editorial images stay in articles at a smaller size, with explicit AI illustration captions.

## Boundaries
Preserve routes, content facts, metadata and production files. All pages share fonts, tokens, controls and header/footer.

## Exports
See tokens.css for the live CSS token export.

### CSS tokens
```css
/* Hallmark · genre: atmospheric · macrostructure: Ecosystem Index · design-system: design.md · designed-as-app */
/* Hallmark · pre-emit critique: P4 H4 E4 S4 R5 V4 */
:root {
 --color-bg: oklch(16% .012 280); --color-surface: oklch(20% .014 280); --color-raised: oklch(25% .015 280);
 --color-text: oklch(95% .006 280); --color-muted: oklch(74% .018 280); --color-border: oklch(34% .018 280);
 --color-accent: oklch(77% .13 290); --color-accent-strong: oklch(83% .10 290); --color-on-accent: oklch(18% .035 290);
 --color-focus: oklch(85% .13 290); --color-error: oklch(80% .13 25); --color-success: oklch(82% .12 155);
 --font-display: 'Space Grotesk Variable', sans-serif; --font-body: 'Inter Variable', sans-serif;
 --space-xs:.25rem; --space-sm:.5rem; --space-md:1rem; --space-lg:1.5rem; --space-xl:2rem; --space-2xl:3rem; --space-3xl:4rem;
 --text-sm:.875rem; --text-body:1rem; --text-title:clamp(1.75rem,3.5vw,2.75rem);
 --radius-sm:.375rem; --radius-md:.625rem; --shadow-soft:none;
 --ease-out:cubic-bezier(.16,1,.3,1); --ease-in:cubic-bezier(.7,0,.84,0); --ease-in-out:cubic-bezier(.65,0,.35,1); --dur-short:120ms;
}

```
### Tailwind v4
```css
@theme {
 --color-bg: oklch(16% .012 280);
 --color-surface: oklch(20% .014 280);
 --color-raised: oklch(25% .015 280);
 --color-text: oklch(95% .006 280);
 --color-muted: oklch(74% .018 280);
 --color-border: oklch(34% .018 280);
 --color-accent: oklch(77% .13 290);
 --color-accent-strong: oklch(83% .10 290);
 --color-on-accent: oklch(18% .035 290);
 --color-focus: oklch(85% .13 290);
 --color-error: oklch(80% .13 25);
 --color-success: oklch(82% .12 155);
 --font-display: 'Space Grotesk Variable', sans-serif;
 --font-body: 'Inter Variable', sans-serif;
 --spacing-xs: .25rem;
 --spacing-sm: .5rem;
 --spacing-md: 1rem;
 --spacing-lg: 1.5rem;
 --spacing-xl: 2rem;
 --spacing-2xl: 3rem;
 --spacing-3xl: 4rem;
 --text-sm: .875rem;
 --text-body: 1rem;
 --text-title: clamp(1.75rem,3.5vw,2.75rem);
 --radius-sm: .375rem;
 --radius-md: .625rem;
 --shadow-soft: none;
 --ease-out: cubic-bezier(.16,1,.3,1);
 --ease-in: cubic-bezier(.7,0,.84,0);
 --ease-in-out: cubic-bezier(.65,0,.35,1);
 --dur-short: 120ms;
}
```
### DTCG
```json
{
  "color-bg": {
    "$value": "oklch(16% .012 280)",
    "$type": "color"
  },
  "color-surface": {
    "$value": "oklch(20% .014 280)",
    "$type": "color"
  },
  "color-raised": {
    "$value": "oklch(25% .015 280)",
    "$type": "color"
  },
  "color-text": {
    "$value": "oklch(95% .006 280)",
    "$type": "color"
  },
  "color-muted": {
    "$value": "oklch(74% .018 280)",
    "$type": "color"
  },
  "color-border": {
    "$value": "oklch(34% .018 280)",
    "$type": "color"
  },
  "color-accent": {
    "$value": "oklch(77% .13 290)",
    "$type": "color"
  },
  "color-accent-strong": {
    "$value": "oklch(83% .10 290)",
    "$type": "color"
  },
  "color-on-accent": {
    "$value": "oklch(18% .035 290)",
    "$type": "color"
  },
  "color-focus": {
    "$value": "oklch(85% .13 290)",
    "$type": "color"
  },
  "color-error": {
    "$value": "oklch(80% .13 25)",
    "$type": "color"
  },
  "color-success": {
    "$value": "oklch(82% .12 155)",
    "$type": "color"
  },
  "font-display": {
    "$value": "'Space Grotesk Variable', sans-serif",
    "$type": "fontFamily"
  },
  "font-body": {
    "$value": "'Inter Variable', sans-serif",
    "$type": "fontFamily"
  },
  "space-xs": {
    "$value": ".25rem",
    "$type": "string"
  },
  "space-sm": {
    "$value": ".5rem",
    "$type": "string"
  },
  "space-md": {
    "$value": "1rem",
    "$type": "string"
  },
  "space-lg": {
    "$value": "1.5rem",
    "$type": "string"
  },
  "space-xl": {
    "$value": "2rem",
    "$type": "string"
  },
  "space-2xl": {
    "$value": "3rem",
    "$type": "string"
  },
  "space-3xl": {
    "$value": "4rem",
    "$type": "string"
  },
  "text-sm": {
    "$value": ".875rem",
    "$type": "string"
  },
  "text-body": {
    "$value": "1rem",
    "$type": "string"
  },
  "text-title": {
    "$value": "clamp(1.75rem,3.5vw,2.75rem)",
    "$type": "string"
  },
  "radius-sm": {
    "$value": ".375rem",
    "$type": "string"
  },
  "radius-md": {
    "$value": ".625rem",
    "$type": "string"
  },
  "shadow-soft": {
    "$value": "none",
    "$type": "string"
  },
  "ease-out": {
    "$value": "cubic-bezier(.16,1,.3,1)",
    "$type": "string"
  },
  "ease-in": {
    "$value": "cubic-bezier(.7,0,.84,0)",
    "$type": "string"
  },
  "ease-in-out": {
    "$value": "cubic-bezier(.65,0,.35,1)",
    "$type": "string"
  },
  "dur-short": {
    "$value": "120ms",
    "$type": "string"
  }
}
```
### shadcn variables
```css
:root { --background:var(--color-bg); --foreground:var(--color-text); --primary:var(--color-accent); --primary-foreground:var(--color-on-accent); --muted:var(--color-surface); --muted-foreground:var(--color-muted); --border:var(--color-border); --input:var(--color-border); --ring:var(--color-focus); --radius:var(--radius-sm); }
```
