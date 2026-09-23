# KINGJOEBRIDD — Design System v1.0

## The Design Idea

KINGJOEBRIDD is a digital fashion house, not a generic tailor's business website.

The experience should combine:
- Fashion editorial
- Modern digital product
- African craftsmanship
- Quiet luxury
- Freedom to explore

The customer should feel like they're entering a premium world of styles and possibilities.

*Don't just shop for clothes. Discover what you want to become.*

## Visual Personality

The interface communicates:

| Trait | Meaning |
| :--- | :--- |
| **Premium** | High-quality, carefully designed |
| **Modern** | Contemporary UI, not traditional business website |
| **Elegant** | Strong typography and restrained visuals |
| **Confident** | KINGJOEBRIDD feels established |
| **Expressive** | Fashion imagery does most of the storytelling |
| **Simple** | Complexity stays behind the scenes |

The balance is important. Premium ≠ complicated. It should never look like a SaaS dashboard or a generic e-commerce storefront.

## Color Direction

We strictly avoid typical tropes like gold, champagne, beige, neon, gradients, or excessive "luxury" colors.

The design relies entirely on a **STRICT MONOCHROME** foundation. This ensures the clothing and the imagery provide all the color and personality.

### The Palette

- **BLACK (`#050505`)**: Primary brand color, major text, borders, active states, primary buttons.
- **OFF-BLACK (`#0D0D0D`)**: Subtle dark backgrounds.
- **WHITE (`#FFFFFF`)**: Main surfaces, text on dark backgrounds, clean space.
- **ASH (`#A6A6A6`)**: Secondary text, subtle borders, muted UI, unread states, inactive tabs.
- **LIGHT ASH (`#E8E8E8`)**: Divider lines, subtle backgrounds, empty states.

There is **NO accent color**.
- Success/Error/Warning states are communicated via monochrome contrast, labels, and borders rather than red/green/yellow text. (e.g. `border-black` vs `border-light-ash`).
- Active states are communicated by `bg-black text-white` vs `bg-white text-ash`.
- Focus states are communicated via high-contrast rings (e.g. `focus:ring-black`).

## Typography

We use typography to balance fashion editorial with modern software clarity.

### Display Typeface: Cormorant Garamond
Used for:
- Hero statements
- Major editorial headings
- Brand storytelling
- Large fashion statements

### Interface Typeface: Manrope
Used for:
- Navigation
- Buttons
- Cards
- Forms
- Chat
- Dashboard
- Body text

## Core Interactions

The core interaction language of the entire platform is focused on taking action on inspiration:

1. **"I WANT THIS"**
2. **"SHOW US YOUR STYLE"**

Whether someone is looking at a suit, a saved style, or an uploaded inspiration, the system makes it easy to go from inspiration → conversation → creation.

## Interface Elements

### Buttons
Buttons should be confident and simple.
- Primary: Solid black background, white text. No gradients.
- Secondary: White background, black border, black text.
- Text action: Underlined black text.

Avoid excessive pill buttons. Form elements and buttons use sharp corners (`rounded-none` or `rounded-sm`) to maintain an editorial, structured feel.

### Border Radius
Use a restrained, structural system. Large rounded corners are avoided. The interface should feel sharp and precise.

### Motion
Motion should feel smooth and expensive, not flashy.
Use:
- Gentle image scale on hover
- Fade/slide transitions
- Soft modal transitions

Avoid:
- Bouncing
- Neon/glow effects
- Parallax effects

### Mobile Experience
Mobile is the primary way many customers will interact.
- Large touch targets
- Bottom-friendly interactions
- Fast swipeable galleries
- Sticky contextual CTAs

### Loading & Empty States
- **Loading states**: Minimal skeletons. No spinners with arbitrary colors.
- **Empty states**: Should feel branded. Instead of "No saved styles", we use "Your style story starts here."

## Admin vs Customer Experience

- **Customer Experience**: Editorial, emotional, visual. Focused on high-quality photography and discovery.
- **Admin Experience**: Operational, efficient, information-rich. Built around fast tables and real-time status tracking for Production and Fulfillment.

Both share the exact same typography, monochrome color palette, and structural design language, ensuring they feel like two halves of the same premium product.
