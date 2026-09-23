# KINGJOEBRIDD

## Product Requirements Document — v1.0

**Product:** KINGJOEBRIDD Bespoke Fashion Platform
**Focus:** Custom Tailoring, Fashion Discovery, Materials & Customer Orders
**Status:** Product Definition
**Version:** 1.0

---

# 1. Product Vision

KINGJOEBRIDD is a premium digital fashion platform that connects customers directly with a professional tailor.

It is not designed primarily as a traditional ecommerce store.

The core experience is:

**Explore → Discover → Inspire → Communicate → Create**

Customers can discover fashion styles, bring their own inspiration, communicate directly with KINGJOEBRIDD, discuss materials and measurements, receive a personalized quote, pay, and track their outfit through production.

### Core Promise

> **Find a style. Make it yours. Let KINGJOEBRIDD bring it to life.**

The platform should make it possible for a customer to say:

> **“This is what I want. Can you make it?”**

and easily start the process.

---

# 2. Business Scope

The platform focuses exclusively on KINGJOEBRIDD's fashion/tailoring business.

### Included

* Bespoke/custom tailoring
* Fashion style discovery
* Customer-provided inspiration
* Material/fabric sales and sourcing
* Customer ↔ tailor communication
* Measurements
* Personalized quotes
* Deposit/full payments
* Order management
* Production tracking
* Pickup
* Delivery
* Customer accounts
* Saved styles
* Admin/tailor management

### Explicitly Excluded

* Land/real-estate sales
* Real-estate listings
* Property management
* AI body scanning
* 3D body measurement
* Complicated digital clothing configurators

---

# 3. Target Customers

The platform serves:

* Men
* Women
* Boys
* Girls
* Individuals ordering for themselves
* Customers ordering for family members

The system should not assume that every customer wants the same type of clothing.

KINGJOEBRIDD should be able to handle different fashion categories and custom requests.

---

# 4. Core Customer Experience

The primary experience should feel like entering a fashion world rather than entering a traditional online store.

### Customer Flow

1. Enter KINGJOEBRIDD
2. Explore styles
3. Search/discover inspiration
4. Select a style or provide their own
5. Communicate with KINGJOEBRIDD
6. Discuss customization
7. Select/request material
8. Provide measurements
9. Receive quote
10. Accept quote
11. Pay deposit or full amount
12. Track production
13. Choose pickup/delivery
14. Receive finished outfit
15. Order becomes part of their history

---

# 5. Style Discovery

The platform will have a visual **Style Library / Collection**.

This is not a traditional product catalogue.

Styles represent inspiration and possibilities.

### Customers can:

* Browse styles
* Search styles
* Filter styles
* View style details
* Save styles
* Download style references
* Share a style with KINGJOEBRIDD
* Request a similar style
* Start an order from a style

### Example categories

Categories may include:

* Men
* Women
* Boys
* Girls
* Native
* Senator
* Agbada
* Kaftan
* Suit
* Gown
* Boubou
* Skirt & Blouse
* Other custom styles

Categories remain flexible because KINGJOEBRIDD is not limited to a fixed set of clothing types.

---

# 6. Style Ownership / Source

The platform should not depend on manually uploading thousands of styles if a legitimate external style/content source can provide suitable references.

Potential external style sources may be evaluated during implementation.

However:

* The system must not rely on unauthorized scraping.
* Copyright/licensing must be respected.
* The source must provide a legitimate API or usage mechanism.
* The architecture should allow KINGJOEBRIDD to add curated styles manually if required.

The platform should therefore treat the Style Library as a flexible content source rather than hard-coding it to one provider.

---

# 7. Style Detail

Every style should have a visual presentation containing relevant information such as:

* Style image
* Style name
* Category
* Gender/target audience
* Description
* Optional material suggestion
* Optional customization notes

Primary action:

**I Want This Style**

Secondary actions may include:

* Save
* Download
* Share
* Request Similar

---

# 8. Custom Style Request

Customers are not restricted to the Style Library.

A customer can select:

**Show Us Your Style**

They can provide:

* Inspiration image
* Multiple images if necessary
* Description
* Desired color
* Material preference
* Additional instructions

Example:

> “I want something similar to this but in dark green, with long sleeves.”

The request enters KINGJOEBRIDD's admin workflow.

---

# 9. Customer Chat

Chat is a core product feature.

Customers must have an account before using the platform chat.

### Chat participants

**Customer ↔ KINGJOEBRIDD**

The initial system uses one general customer-to-tailor conversation experience.

### Contextual attachments

When a customer starts a conversation from a style, the selected style is automatically attached.

The tailor can therefore see:

* Customer
* Selected style
* Style image
* Customer message
* Uploaded inspiration
* Relevant order/request information

The customer should not have to repeatedly explain which style they are referring to.

---

# 10. Material System

KINGJOEBRIDD sells materials/fabrics and can also source requested materials.

Customers can:

* Browse available materials
* Select a material
* Ask about a material
* Request a specific material
* Ask KINGJOEBRIDD to source unavailable material

If a requested material is unavailable, KINGJOEBRIDD can respond with:

* Availability
* Alternative material
* Sourcing cost
* Expected availability

Material cost can become part of the final quote.

---

# 11. Measurements

The platform should keep measurement collection simple.

Customers have three options:

### Option A — Physical Measurement

Customer visits KINGJOEBRIDD and is measured.

### Option B — Existing Measurements

Customer submits measurements they already have.

### Option C — Submit Later

Customer can begin the ordering process and provide measurements later.

### Measurement Profile

Customers can save measurements to their account for future orders.

Future versions may support multiple measurement profiles, such as:

* Self
* Spouse
* Child
* Family member

---

# 12. Quote System

Pricing is not necessarily fixed.

The final price may depend on:

* Style
* Complexity
* Material
* Material sourcing
* Customization
* Measurements
* Quantity
* Delivery
* Other agreed requirements

KINGJOEBRIDD creates a personalized quote.

A quote may contain:

* Tailoring fee
* Material cost
* Sourcing cost
* Additional charges
* Delivery cost
* Total
* Deposit amount

The customer receives the quote through the platform.

---

# 13. Quote Acceptance

Customer can:

**Accept Quote**

or continue communicating with KINGJOEBRIDD.

Once the quote is accepted, the customer proceeds to payment.

---

# 14. Payment

The platform supports two payment options:

### Deposit

Customer pays the required deposit.

### Full Payment

Customer pays the complete quoted amount.

After successful payment:

**Quote → Active Order**

Payment provider will be selected during technical planning.

The system should be designed to support a Nigerian payment provider such as Paystack or Flutterwave, subject to final evaluation.

---

# 15. Order System

An order represents an agreed tailoring job.

The order should contain:

* Customer
* Style/inspiration
* Custom instructions
* Material
* Measurements
* Quote
* Payment information
* Production status
* Fulfillment method
* Delivery information where applicable
* Conversation reference

---

# 16. Production Tracking

Customers should be able to see meaningful production progress.

Initial status flow:

**Order Confirmed**
↓
**Measurements Received**
↓
**Measurements Approved**
↓
**Material Ready**
↓
**Cutting**
↓
**Sewing**
↓
**Finishing**
↓
**Quality Check**
↓
**Ready**

Not every order necessarily requires every stage.

The admin can update the relevant status.

---

# 17. Fulfillment

Customers can choose:

### Pickup

Customer collects the completed outfit.

### Delivery

The outfit is delivered to the customer.

Delivery details should be associated with the order.

---

# 18. Customer Account

Customers have an account where they can access:

* Profile
* Saved Styles
* Measurements
* Conversations
* Style Requests
* Quotes
* Orders
* Payments
* Delivery information

The account becomes the customer's personal KINGJOEBRIDD fashion workspace.

---

# 19. Saved Styles

Customers can save styles they like.

Saved styles appear inside:

**My Styles**

This allows customers to collect inspiration before deciding what they want to make.

---

# 20. Admin/Tailor Dashboard

KINGJOEBRIDD is the primary administrator.

The dashboard should provide visibility into the entire business.

### Main areas

* Dashboard
* Styles
* Collections
* Materials
* Customers
* Style Requests
* Conversations
* Quotes
* Measurements
* Orders
* Payments
* Delivery
* Settings

---

# 21. Admin Dashboard — Dashboard

The main dashboard should provide a quick business overview.

Potential information:

* New requests
* Active conversations
* Pending quotes
* Unpaid quotes
* Active orders
* Orders in production
* Orders ready
* Recent payments
* Recent customers

The dashboard should prioritize actionable information rather than unnecessary statistics.

---

# 22. Admin — Style Management

If the platform uses external style content, the system should still allow KINGJOEBRIDD to manage the styles that appear on the platform.

Possible actions:

* Feature style
* Hide style
* Categorize style
* Add custom style
* Edit style information
* Remove style
* Organize collections

---

# 23. Admin — Material Management

KINGJOEBRIDD can manage materials.

Possible fields:

* Material name
* Image
* Description
* Availability
* Price
* Colors
* Notes

The system should also support:

**Customer requested material → Admin sources material**

---

# 24. Admin — Customer Management

KINGJOEBRIDD can view customers and relevant customer information.

Customer profile may include:

* Basic account information
* Measurements
* Saved styles
* Conversations
* Requests
* Quotes
* Orders
* Payments

---

# 25. Admin — Conversations

KINGJOEBRIDD can see customer conversations.

Conversation context should make it easy to understand:

* Who is the customer?
* What style do they want?
* What images did they send?
* What material are they requesting?
* What measurements are available?
* Is there an associated quote?
* Is there an associated order?

---

# 26. Admin — Style Requests

Requests should be organized into useful states such as:

* New
* Reviewing
* Discussing
* Quote Required
* Accepted
* Converted to Order
* Completed/Closed

---

# 27. Admin — Quote Management

KINGJOEBRIDD can:

* Create quote
* Edit quote
* Send quote
* View customer response
* See payment status
* Cancel/expire quote where necessary

---

# 28. Admin — Order Management

KINGJOEBRIDD can:

* View orders
* Open order details
* Review measurements
* Review style
* Review material
* Review payment
* Update production stage
* Update fulfillment
* Mark order complete

---

# 29. Notifications

The platform should eventually notify customers about important events.

Examples:

* New message
* Quote received
* Quote accepted
* Payment received
* Measurement request
* Order status changed
* Order ready
* Delivery update

The initial notification strategy can be finalized during architecture planning.

---

# 30. Search

Search should help customers discover styles rather than merely search products.

Customers should be able to search terms such as:

* Senator
* Agbada
* Suit
* Gown
* Kaftan
* Native
* Boubou
* Wedding
* Casual
* Corporate

The search system should be extensible.

---

# 31. Public Website Structure

Initial public/customer structure:

### Home

Brand introduction and primary fashion experience.

### Collection

Style exploration.

### Style Detail

Detailed style inspiration page.

### Search

Global style discovery.

### Materials

Material discovery.

### Style Request

Upload/custom request flow.

### How It Works

Explains the KINGJOEBRIDD process.

### About

Brand/tailor story.

### Contact

Business contact information.

### Account

Customer workspace.

---

# 32. Customer Account Structure

Potential account sections:

```text
Account
├── Overview
├── My Styles
├── Measurements
├── Conversations
├── Style Requests
├── Quotes
├── Orders
├── Payments
└── Profile
```

---

# 33. Core UX Principle

The platform must not feel like:

**Browse → Add to Cart → Checkout**

Instead it should feel like:

**Enter → Explore → Discover → Imagine → Ask → Collaborate → Create**

The customer should always have freedom to express what they want.

---

# 34. Design Philosophy

The visual experience should be:

* Premium
* Modern
* Luxurious
* Friendly
* Fashion-forward
* Highly visual
* Easy to understand
* Easy to navigate
* Responsive
* Mobile-friendly
* Visually memorable

Luxury should feel **refined**, not stereotypical.

The design should avoid becoming another generic black-and-gold fashion website.

Brand identity, colors, typography, imagery direction, logo treatment, motion, spacing, and component language will be created from scratch during the design phase.

---

# 35. MVP Definition

The first production-ready version should prioritize the actual business workflow.

### MVP Customer Features

* Account registration/login
* Homepage
* Style Library
* Style search
* Style details
* Save styles
* Custom style request
* Image upload
* Customer ↔ KINGJOEBRIDD chat
* Style attachment in chat
* Material browsing/request
* Measurement submission
* Quote viewing
* Quote acceptance
* Deposit/full payment
* Order creation
* Order tracking
* Pickup/delivery selection
* Customer dashboard

### MVP Admin Features

* Admin authentication
* Dashboard
* Customer management
* Style management
* Material management
* Style requests
* Conversations
* Quotes
* Measurements
* Orders
* Payment visibility
* Production status management
* Fulfillment management

---

# 36. Future Features

Potential future improvements:

* Multiple family measurement profiles
* Reviews
* Customer ratings
* Loyalty/rewards
* Promotions
* Referral system
* Advanced style recommendations
* Appointment booking
* In-person consultation scheduling
* Automated notifications
* Advanced analytics
* Multiple staff accounts
* Staff permissions
* Order invoices/receipts
* More advanced delivery integrations
* Personal style collections
* AI-assisted style discovery, if genuinely useful

These are not required for the first version.

---

# 37. Product Architecture Principle

The system should be modular.

The platform should allow future expansion without rebuilding the entire application.

Primary domains:

```text
Authentication
Customers
Styles
Collections
Materials
Style Requests
Chat
Measurements
Quotes
Payments
Orders
Production
Delivery
Notifications
Administration
```

---

# 38. Technology Direction

Preferred technology stack:

### Frontend

**Next.js**

Responsibilities:

* Customer website
* Admin interface
* Authentication UI
* Style discovery
* Chat interface
* Customer dashboard
* Order tracking

### Styling

**Tailwind CSS**

Used for the design system and responsive UI.

### Backend

**Laravel / PHP**

Responsibilities:

* API
* Authentication/authorization
* Business logic
* Database operations
* Quotes
* Orders
* Payments
* File handling
* Chat backend
* Notifications
* Admin operations

### Database

Database technology will be selected during the architecture phase.

### Storage

A proper object/file storage system should be used for:

* Inspiration images
* Style images where applicable
* Material images
* Customer uploads

---

# 39. Security Requirements

The system must protect:

* Customer accounts
* Measurements
* Uploaded images
* Conversations
* Payment information
* Orders
* Personal information

Customers must only access their own private information.

Admin access must be protected separately.

Uploaded files must be validated and securely stored.

Payment verification must occur server-side.

---

# 40. Fundamental Business Rules

### Rule 1

A customer must have an account to use platform chat.

### Rule 2

A customer can order from an existing style or provide their own inspiration.

### Rule 3

A style is inspiration, not necessarily a fixed product with a fixed price.

### Rule 4

Final pricing can be determined through consultation and quotation.

### Rule 5

An order becomes active after quote acceptance and the required payment.

### Rule 6

Customers can provide measurements now or later.

### Rule 7

Customers can use existing measurements or be measured physically.

### Rule 8

Materials can be selected from available stock or requested for sourcing.

### Rule 9

Customers can choose pickup or delivery.

### Rule 10

Production progress should be visible to the customer.

---

# 41. The Product's Unique Advantage

The strongest differentiator is not simply:

> “KINGJOEBRIDD sells clothes online.”

It is:

> **KINGJOEBRIDD lets customers discover what they want—or bring their own idea—and turn that idea into a real custom outfit through direct communication with the tailor.**

This creates a bridge between:

**Fashion Inspiration**

and

**Physical Custom Creation.**

---

# 42. Product Experience Statement

The entire platform should communicate one idea:

> **You don't have to find the perfect outfit. You just have to find what inspires you. KINGJOEBRIDD can take it from there.**

---

# 43. Source of Truth

This PRD becomes the foundation for the next project documents.

The planned documentation sequence is:

```text
PRD
 ↓
Proposal
 ↓
UX / Information Architecture
 ↓
Design System
 ↓
Technical Architecture
 ↓
Database Design
 ↓
API Specification
 ↓
Implementation Plan
 ↓
Development
```

Any future feature should be evaluated against the product vision and business workflow defined here.
