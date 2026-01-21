# BOOK MARKET - Design System Quick Reference

## Color Palette

```
BACKGROUND GRADIENT:
linear-gradient(135deg, #0F172A, #020617)
Dark Navy → Deep Black

PRIMARY ACCENT (INDIGO):
#6366F1 - Action buttons, active states, CTAs
Hover: #4F46E5 - Darker shade for interactions

SECONDARY ACCENT (EMERALD):
#10B981 - Success states, positive actions
Used for: "Exchange verified", money saved, environmental impact

ATTENTION ACCENT (AMBER):
#F59E0B - QR codes, alerts, important info
Used for: QR exchange, warnings, conditions

TEXT COLORS:
#F8FAFC - Primary text (brightest)
#CBD5E1 - Secondary text (medium)
#94A3B8 - Muted text (darkest)
```

## Card Components

### Glass Card Standard
```css
background: rgba(15, 23, 42, 0.4);
backdrop-filter: blur(12px);
border: 1px solid rgba(255, 255, 255, 0.08);
border-radius: 16px;
box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
```

### Glass Card Large
```css
background: rgba(15, 23, 42, 0.4);
backdrop-filter: blur(12px);
border: 1px solid rgba(255, 255, 255, 0.08);
border-radius: 24px;
box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
```

### Hover Effects
- Translate Y: -4px (lift effect)
- Border color: rgba(indigo, 0.3)
- Shadow increase: Enhanced depth

## Button Styles

### Primary Button
- Background: #6366F1
- Hover: #4F46E5
- Shadow: 0 0 20px rgba(99, 102, 241, 0.3)
- Hover Shadow: 0 0 30px rgba(99, 102, 241, 0.5)

### Secondary Button
- Background: rgba(15, 23, 42, 0.4)
- Border: 1px solid rgba(255, 255, 255, 0.12)
- Hover: rgba(15, 23, 42, 0.6)

### Outline Button
- Background: transparent
- Border: 1px solid rgba(255, 255, 255, 0.12)
- Hover: rgba(255, 255, 255, 0.05)

## Typography

### Headings
- H1: 56px-64px, Font-black (900), Gradient text
- H2: 24px-32px, Font-bold (700)
- H3: 20px, Font-bold (700)

### Body Text
- Large: 18px, Font-semibold (600)
- Normal: 14px-16px, Font-medium (500)
- Small: 12px-14px, Font-regular (400)

## Spacing System
- XS: 4px
- SM: 8px
- MD: 16px
- LG: 24px
- XL: 32px
- 2XL: 48px

## Border Radius
- Small: 8px
- Medium: 12px
- Large: 16px
- XL: 24px
- Full: 9999px (pills)

## Animations

### Entrance Animations
- **slide-down**: 20px Y-axis down, 0.5s ease-out
- **slide-up**: 20px Y-axis up, 0.6s ease-out
- **fade-in**: Opacity 0→1, 0.5s ease-out
- **scale-in**: Scale 95%→100%, 0.4s ease-out

### Continuous Animations
- **float**: Y-axis ±8px, 3s ease-in-out infinite
- **glow-border**: Box-shadow pulse, 2s ease-in-out infinite

### Interaction
- **hover-lift**: Transform Y -4px
- **hover-scale**: Scale 105%
- **active-scale**: Scale 95%

## Component-Specific Colors

### Intent Badges
- **Sell**: Amber (#F59E0B)
- **Lend**: Blue (#3B82F6)
- **Donate**: Emerald (#10B981)

### Status Messages
- **Success**: Emerald background, emerald border
- **Error**: Red background, red border
- **Info**: Indigo background, indigo border

### Achievement Badges
- Book Sharer: Blue
- Eco Champion: Purple
- Reuse Legend: Indigo
- Sustainability Hero: Emerald
- Saver: Emerald
- Money Master: Amber
- Green Guardian: Emerald
- Planet Protector: Cyan

## Responsive Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## Accessibility
- Minimum text contrast: 4.5:1
- Focus states: 2px ring with indigo color
- Touch targets: Minimum 44px x 44px

## Dark Mode Notes
- Always use text-slate-50 for primary text on dark background
- Use text-slate-300 for secondary text
- All cards must have semi-transparent dark background
- All interactive elements must have clear hover states
- Focus indicators must be highly visible (ring-indigo-500)

---

Last Updated: January 21, 2026
Design Language: Premium Dark Mode Glassmorphism
Target Quality: Startup-Grade, Award-Winning Product
