# Gothic Elegance Dashboard - Style Guide

## 🎨 Design Philosophy
A sophisticated data analytics dashboard inspired by luxury and modern aesthetics, featuring glassmorphism effects, deep gothic colors, and premium metallic accents.

## 🌈 Color Palette

### Primary Colors
- **Gothic Black**: `#0a0a0a` - Primary background
- **Gothic Charcoal**: `#1a1a1a` - Secondary surfaces
- **Gothic Slate**: `#2a2a2a` - Tertiary elements

### Accent Colors
- **Gothic Purple**: `#6b46c1` - Primary accent
- **Gothic Violet**: `#8b5cf6` - Secondary accent
- **Gothic Accent**: `#a855f7` - Interactive elements

### Metallic Tones
- **Gothic Silver**: `#c0c0c0` - Text and borders
- **Gothic Platinum**: `#e5e7eb` - Primary text

## 🔮 Glassmorphism Effects

### Layer Structure
1. **Background**: Animated gradient orbs with blur
2. **Container**: `backdrop-blur-xl` with translucent backgrounds
3. **Overlay**: Subtle gradient overlays for depth
4. **Border**: Semi-transparent borders with metallic tones

### Implementation
```css
/* Primary Glass Container */
backdrop-blur-xl bg-gothic-charcoal/30 border border-gothic-silver/20

/* Secondary Glass Elements */
backdrop-blur-sm bg-gothic-slate/40 border border-gothic-silver/10

/* Hover Effects */
hover:bg-gothic-purple/20 hover:shadow-gothic-accent/30
```

## 📝 Typography

### Font Hierarchy
- **Headers**: Bold, tracking-wide, gradient text
- **Subheaders**: Semibold, uppercase, letter-spacing
- **Body**: Light to medium weight, readable contrast
- **Labels**: Bold, uppercase, tracking-widest

### Text Colors
- **Primary**: `text-gothic-platinum`
- **Secondary**: `text-gothic-silver`
- **Accent**: `text-gothic-accent`
- **Gradient**: `bg-gradient-to-r from-gothic-silver to-gothic-accent bg-clip-text text-transparent`

## 🎭 Component Patterns

### Cards
```jsx
<div className="relative backdrop-blur-xl bg-gothic-charcoal/40 border border-gothic-silver/20 p-8 rounded-3xl shadow-2xl shadow-gothic-purple/20 hover:shadow-gothic-accent/30 transform hover:scale-105 transition-all duration-500">
  <div className="absolute inset-0 bg-gradient-to-br from-gothic-purple/20 to-transparent rounded-3xl"></div>
  <div className="relative z-10">
    {/* Content */}
  </div>
</div>
```

### Navigation Items
```jsx
<Link className="flex items-center px-6 py-4 mb-2 rounded-xl transition-all duration-300 group bg-gradient-to-r from-gothic-purple to-gothic-violet text-white shadow-2xl shadow-gothic-purple/50 border border-gothic-accent/50">
  <span className="mr-4 transition-transform duration-300 group-hover:scale-110 text-gothic-accent">
    {icon}
  </span>
  <span className="font-semibold tracking-wide">{label}</span>
</Link>
```

## ✨ Animations

### Keyframes
- **Float**: Subtle vertical movement for ambient elements
- **Glow**: Pulsing shadow effects for interactive elements
- **Pulse**: Breathing effect for loading states

### Transitions
- **Duration**: 300ms for interactions, 500ms for transforms
- **Easing**: `ease-in-out` for smooth animations
- **Hover**: Scale transforms (1.02-1.05) with shadow changes

## 🎯 Interactive States

### Hover Effects
- **Scale**: `hover:scale-105` for cards
- **Glow**: `hover:animate-glow` for buttons
- **Shadow**: Colored shadows matching element theme
- **Background**: Subtle opacity changes

### Active States
- **Navigation**: Full gradient background with white text
- **Buttons**: Increased shadow and slight scale
- **Cards**: Enhanced glow and border brightness

## 📱 Responsive Design

### Breakpoints
- **Mobile**: Single column layouts, reduced padding
- **Tablet**: 2-column grids, maintained glassmorphism
- **Desktop**: Full multi-column layouts, enhanced effects

### Spacing System
- **Micro**: 2-4px for borders and fine details
- **Small**: 8-16px for component padding
- **Medium**: 24-32px for section spacing
- **Large**: 48-64px for major layout gaps

## 🔧 Implementation Guidelines

### Glassmorphism Layers
1. Always use `relative` positioning for containers
2. Apply `backdrop-blur-xl` for primary glass effect
3. Use `absolute inset-0` for gradient overlays
4. Maintain `relative z-10` for content layers

### Color Usage
- Use opacity modifiers (e.g., `/20`, `/30`) for translucency
- Apply gradients for text and backgrounds
- Maintain contrast ratios for accessibility
- Use metallic tones for borders and accents

### Performance Considerations
- Limit backdrop-blur usage to prevent performance issues
- Use CSS transforms for animations
- Optimize gradient complexity
- Implement proper z-index hierarchy

## 🎨 Chart Styling

### ApexCharts Theme
```javascript
theme: { mode: 'dark' }
colors: ['#8b5cf6', '#a855f7', '#6b46c1']
grid: { borderColor: '#2a2a2a' }
title: { 
  style: { 
    color: '#c0c0c0', 
    fontSize: '18px', 
    fontWeight: 'bold' 
  } 
}
```

### Chart Containers
- Glassmorphism backgrounds with subtle gradients
- Rounded corners (3xl) for modern appearance
- Hover effects with enhanced shadows
- Consistent padding and spacing

This style guide ensures consistent implementation of the Gothic Elegance theme across all dashboard components while maintaining usability and performance.