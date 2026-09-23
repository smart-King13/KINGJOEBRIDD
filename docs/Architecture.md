# KINGJOEBRIDD — Laravel Domain Architecture v1.0

## 1. System Architecture

The KINGJOEBRIDD platform is designed as a decoupled, headless architecture:

*   **Frontend**: Next.js 16 (React, TypeScript, Tailwind CSS)
*   **Backend**: Laravel 13 (PHP 8.3)
*   **Database**: PostgreSQL / Supabase
*   **Authentication**: Laravel Sanctum (token-based API authentication)

### Separation of Responsibilities

#### Frontend (Next.js)
The frontend acts purely as a presentation layer and API consumer. It is responsible for:
*   User interface, components, and pages.
*   Client-side routing and navigation.
*   Managing client-side state, loading indicators, and error boundaries.
*   Formatting data received from the backend for display.

#### Backend (Laravel)
Laravel serves as the core business logic and API engine. It is responsible for:
*   Authentication and Authorization (Sanctum).
*   Data validation and integrity.
*   Enforcing all business rules and domain operations.
*   Structuring and returning standardized API responses.
*   Managing state transitions across domains (e.g., from Quote to Order).

#### Database (PostgreSQL)
*   Acts as the persistent storage layer.
*   *Note: Database architecture and schemas are explicitly deferred to the Database Architecture v1.0 phase.*

---

## 2. Business Relationship Model

KINGJOEBRIDD is a premium digital fashion house and bespoke tailoring platform. It is **NOT modeled as a traditional e-commerce store.** 

### Why not traditional e-commerce?
Standard e-commerce operates on a `Product -> Cart -> Checkout` flow where items are predefined and instantly purchasable. KINGJOEBRIDD's core business involves bespoke tailoring, style inspiration, custom measurements, material selection, and dynamic quoting. A "Style" is an inspiration reference, not a direct SKU.

### The Core Flow
The platform's business logic is centered around relationship building and custom orders:

```text
Style / Request
       ↓
Conversation
       ↓
Material + Measurements + Inspiration
       ↓
Quote
       ↓
Payment
       ↓
Order
       ↓
Production
       ↓
Pickup / Delivery
       ↓
Completed
```

**Key Distinctions:**
*   A **Style** is not an **Order**.
*   A **Conversation** is not an **Order**.
*   A **Quote** is not a **Payment**.
*   A customer can engage in a **Conversation** without placing an Order.
*   A customer can use an existing **Style** as inspiration without ordering that exact design.

---

## 3. Laravel Structure

To cleanly manage these distinct operations, the backend is structured using a Domain-centric approach within standard Laravel conventions.

```text
backend/app/
├── Models/           # Eloquent models, organized by domain namespaces
├── Http/
│   ├── Controllers/  # API Controllers, organized by domain namespaces
│   ├── Requests/     # Form Requests for validation
│   └── Resources/    # API Resources for JSON serialization
├── Services/         # Business logic and complex operations
├── Actions/          # Single-responsibility actions
├── Policies/         # Authorization policies
└── Enums/            # System enumerations
```

---

## 4. Domain Boundaries and Responsibilities

The system is organized into the following cohesive domains:

### 1. Identity
*   **Responsibilities**: Customer accounts, profiles, authentication, authorization, and roles (`customer`, `admin`).

### 2. Styles
*   **Responsibilities**: Managing styles, style images, categories, collections, featured styles, saved styles, and style references. Styles serve as inspiration, not purchasable products.

### 3. Materials
*   **Responsibilities**: Managing fabrics, materials, material information, availability, sourcing, and customer material requests.

### 4. Conversations
*   **Responsibilities**: Customer ↔ KINGJOEBRIDD communication, messages, attachments. Serves as the central hub for linking style context, inspiration, materials, measurements, and quotes without forcing customers to repeat information.

### 5. Style Requests
*   **Responsibilities**: Managing requests from customers who want something created from their own inspiration (custom descriptions, preferred colors/materials, notes).

### 6. Measurements
*   **Responsibilities**: Customer measurement profiles, measurement records, and history. **Measurements are versioned**, not overwritten, to support historical tracking and multiple profiles.

### 7. Quotes
*   **Responsibilities**: Bespoke pricing (tailoring, material, sourcing, customization, delivery, discount, total) and quote lifecycles (Draft, Sent, Accepted, Paid, Expired, Cancelled).

### 8. Payments
*   **Responsibilities**: Managing deposits, full payments, balance payments, references, and provider status. Orders can have multiple associated payments.

### 9. Orders
*   **Responsibilities**: The actual business transaction, bridging the gap between accepted Quotes/Payments and Production/Fulfillment.

### 10. Production
*   **Responsibilities**: The tailoring workflow and lifecycle (e.g., Confirmed, Measurements, Cutting, Sewing, Finishing, Ready).

### 11. Fulfillment
*   **Responsibilities**: Delivery and pickup methods, tracking, fees, and recipient information.

### 12. Notifications
*   **Responsibilities**: Managing automated alerts (new messages, quote updates, payment success, order status) across various future channels (in-app, email, SMS).

---

## 5. Future Database Boundary

At this stage, **no business database schema has been created**. The architecture deliberately isolates the domain structure (controllers, models, services) from the persistent schema. The underlying tables, migrations, relationships, seeders, and factories will be constructed strictly within the bounds of these defined domains during the **Database Architecture v1.0** phase.
