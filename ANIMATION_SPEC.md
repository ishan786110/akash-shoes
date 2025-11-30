# Animation Implementation Specification

## Overview
Premium animation system for Aakash Shoes website with focus on performance, accessibility, and polished interactions.

## Timing Scale
- **xs**: 120ms - Quick micro-interactions (hover states, focus indicators)
- **sm**: 200ms - Standard transitions (button clicks, color changes)
- **md**: 350ms - Medium transitions (card reveals, scroll animations)
- **lg**: 600ms - Slow transitions (image scaling, parallax effects)
- **xl**: 900ms - Decorative animations (hero entrance, Lottie plays)

## Easing Functions
- **Primary**: `cubic-bezier(0.22, 0.9, 0.35, 1)` - Smooth, natural deceleration
- **Elastic**: `cubic-bezier(0.18, 1.2, 0.36, 1)` - Playful bounce for emphasis

## Implementation Details

### Hero Section
- ✅ Parallax scroll effect on background (speed: 0.3)
- ✅ Mouse parallax on desktop (speed: 0.015)
- ✅ Split-text character reveal with 70ms stagger
- ✅ Content fade-up with sequential delays (500-1400ms)
- ✅ Button hover: scale + shadow (elastic, sm timing)
- ✅ Decorative elements animate in with delays

### Navigation
- ✅ Scroll-based style change (transparent → solid)
- ✅ Animated underline on hover (width transition, md timing)
- ✅ Hamburger morphs to X (sm timing)
- ✅ Mobile menu slide-in with 60ms stagger per item
- ✅ Smooth height transition for mobile menu

### Cards (Category & Products)
- ✅ Scroll-triggered fade + translate (md timing)
- ✅ Staggered animation (60ms delay per card)
- ✅ Hover lift effect (-translate-y)
- ✅ Image scale on hover (lg timing, scale: 1.1)
- ✅ Shadow transition on hover (shadow-strong)

### Buttons
- ✅ Hover scale effect (elastic, sm timing)
- ✅ Icon translate on hover
- ✅ Shadow enhancement on hover
- ✅ Focus ring animations

### Performance Optimizations
- ✅ Only animate transform & opacity properties
- ✅ Use `will-change` sparingly
- ✅ Lazy load images with `loading="lazy"`
- ✅ RequestAnimationFrame for parallax effects
- ✅ Passive event listeners for scroll
- ✅ Disable heavy effects on mobile
- ✅ Check prefers-reduced-motion

### Accessibility
- ✅ `prefers-reduced-motion` removes all animations
- ✅ Focus states with visible rings
- ✅ Keyboard navigation support
- ✅ Decorative animations don't interfere with interaction
- ✅ All transitions respect user preferences

## File Structure
```
src/
├── hooks/
│   ├── use-scroll-animation.tsx  # Intersection observer for scroll reveals
│   └── use-parallax.tsx          # Parallax effects (scroll & mouse)
├── components/
│   └── animations/
│       └── SplitText.tsx         # Character-by-character text reveal
├── lib/
│   └── animations.ts             # Animation utilities & constants
└── index.css                      # Global animation variables
```

## Browser Support
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (with reduced effects)

## Performance Targets
- ✅ 60fps animations on desktop
- ✅ Smooth scrolling (no jank)
- ✅ LCP < 2.5s
- ✅ No layout shifts (CLS < 0.1)

## Testing Checklist
- [x] Test on Chrome, Firefox, Safari
- [x] Test mobile responsiveness
- [x] Test with prefers-reduced-motion enabled
- [x] Verify keyboard navigation
- [x] Check scroll performance
- [x] Validate animation timing
- [x] Test hover states on all interactive elements

## Future Enhancements
- [ ] Add gallery lightbox with backdrop fade
- [ ] Implement form field animations (float labels)
- [ ] Add page transition animations
- [ ] Create loading skeleton states
- [ ] Add success/error toast animations
