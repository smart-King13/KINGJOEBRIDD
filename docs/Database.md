# KINGJOEBRIDD Database Architecture v1.0

This document maps out the backend database architecture, focusing on the bespoke fashion relationships. It represents the state of the database post-implementation of the v1.0 schema.

## Database Strategy

*   **Database Engine**: PostgreSQL
*   **Money Storage**: All monetary fields (prices, subtotals, fees) are stored as integer minor units (`bigInteger`). For NGN (₦), this represents Kobo (e.g., `₦1,000` is stored as `100000`).
*   **UUIDs**: The existing Laravel `users.id` remains a `bigint` for Sanctum authentication compatibility. All core business entities (Styles, Orders, Quotes, etc.) use `UUID`s as primary keys.
*   **Storage**: Binary file contents live in Supabase Storage. The database only stores metadata in the polymorphic `attachments` table.
*   **Notifications**: Powered by standard Laravel database notifications (`notifications` table).
*   **Soft Deletes**: Used strategically on `styles` and `materials` to preserve historical integrity, avoiding broken foreign keys on old orders.

## Core Tables & Relationships

### Identity
*   `users`: The identity foundation. Added a `role` string column (`customer`, `admin`).

### Styles & Materials
*   `categories` & `collections`: Used for discovering and organizing Styles.
*   `styles`: Represents a fashion inspiration or reference. Connects to `category_id` and `collection_id`.
*   `style_images`: Primary and secondary images for a style.
*   `saved_styles`: Pivot table mapping `users` to `styles` (with a composite unique constraint).
*   `materials`: Tracks fabrics/materials. Can be marked as `is_available` or require bespoke sourcing. Base prices are stored in minor units.
*   `material_images`: Images referencing the materials.

### Bespoke Interaction
*   `style_requests`: Customers can submit custom requests (describing colors, materials, uploading inspiration).
*   `attachments`: A polymorphic table mapping files to `style_requests`, `messages`, `production_updates`, etc.
*   `conversations`: The core communication hub belonging to a `user`. Connects to its context via a polymorphic `contextable` relation (allowing a conversation to reference a `Style`, `StyleRequest`, or `Order` without circular dependencies).
*   `messages`: Individual messages within a conversation. `sender_id` has a `nullOnDelete` constraint to preserve message history if a user is deleted.

### Measurements
*   `measurement_profiles`: Groups measurements (e.g., "My Profile").
*   `measurement_sets`: Version-controlled sets of measurements. Uses a composite unique constraint on `(profile_id, version)`.
*   `measurement_values`: Key-value pairs for the actual physical measurements (e.g., `shoulder: 18 inch`).

### Financials & Quotes
*   `quotes`: Pricing proposal linked to a `user` and optionally a `conversation`. Contains minor unit fields for `subtotal`, `discount`, and `total`.
*   `quote_items`: The breakdown of the quote (Tailoring, Material, Sourcing, Customization, Delivery, Discount, Other).
*   `payments`: Tracks multiple payments (deposit, balance, full) against an `order_id` (and optionally `quote_id`).

### The Transaction
*   `orders`: The central business transaction. Connects via nullable foreign keys to `quote_id` (unique), `style_id`, `style_request_id`, `measurement_set_id`, and `material_id`. It stores a JSON `snapshot` of critical historical info (like measurements at the time of the order).
*   `production_updates`: Tracks the tailoring lifecycle (e.g., Cutting, Sewing, Ready).
*   `fulfillments`: Manages pickup or delivery. Stores `delivery_fee` in minor units.

## ER Relationship Overview

```text
USER (id: bigint)
 │
 ├─────────────── SAVED STYLES (user_id, style_id)
 │
 ├─────────────── STYLE REQUESTS (user_id)
 │                     │
 │                     └──── ATTACHMENTS (polymorphic)
 │
 ├─────────────── CONVERSATIONS (user_id)
 │                     │
 │                     ├──── CONTEXT (polymorphic: Style, StyleRequest, Order)
 │                     │
 │                     └──── MESSAGES
 │                             │
 │                             └──── ATTACHMENTS (polymorphic)
 │
 ├─────────────── MEASUREMENT PROFILES (user_id)
 │                     │
 │                     └──── MEASUREMENT SETS (versioned)
 │                             │
 │                             └──── MEASUREMENT VALUES
 │
 ├─────────────── QUOTES (user_id)
 │                     │
 │                     └──── QUOTE ITEMS
 │
 └─────────────── ORDERS (user_id)
                       │
              ┌────────┼─────────┐
              │        │         │
          PAYMENTS  PRODUCTION  FULFILLMENT
```

## Critical Business Rules Upheld

1.  **"I WANT THIS"**: A customer can select a Style, creating a Conversation with `contextable_type = 'style'`.
2.  **No Fixed Products**: A Style does not have a price or stock; it generates a Quote.
3.  **Multiple Payments**: The `payments` table handles split deposits and balances.
4.  **Versioned Measurements**: Orders reference a specific, immutable `MeasurementSet`.
5.  **No Giant JSON Data**: The schema is fully normalized. JSON is only used for metadata or static historical `snapshots`.
