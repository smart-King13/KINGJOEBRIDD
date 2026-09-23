# KINGJOEBRIDD API Architecture v1.1

This document defines the complete API contract for the KINGJOEBRIDD backend, ensuring seamless integration between Next.js and PostgreSQL/Supabase via Laravel 13.

It strictly adheres to a decoupled architecture (Next.js → Laravel API → PostgreSQL/Supabase) and maintains the bespoke fashion domain structure (no Cart/Checkout flows).

---

## 1. Global API Standards

### Base Architecture
- **Base URL**: `/api/v1`
- **Content-Type**: `application/json`
- **Authentication**: Laravel Sanctum (Bearer Token)
- **Roles**: `customer` (default), `admin`

### Global Pagination, Filtering, & Sorting
List endpoints accept standard query parameters:
- `?page=` (integer, default: 1)
- `&per_page=` (integer, default: 15, max: 100)
- `&search=` (string, optional, searches relevant text fields)
- `&sort=` (string, field name to sort by, default: `created_at`)
- `&direction=` (string, `asc` or `desc`, default: `desc`)

### Response Envelopes

**1. Success (Single Resource) (200 OK or 201 Created)**
```json
{
  "data": { "id": "uuid", "..." : "..." },
  "message": "Resource retrieved successfully."
}
```

**2. Success (Collection / Pagination) (200 OK)**
```json
{
  "data": [ { "id": "uuid" }, { "id": "uuid" } ],
  "meta": {
    "current_page": 1,
    "last_page": 5,
    "per_page": 15,
    "total": 75
  }
}
```

**3. Validation Errors (422 Unprocessable Entity)**
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "preferred_color": ["The preferred color field is required."]
  }
}
```

**4. Client/Server Errors**
- **401 Unauthorized**: `{ "message": "Unauthenticated." }`
- **403 Forbidden**: `{ "message": "Forbidden." }`
- **404 Not Found**: `{ "message": "Resource not found." }`
- **409 Conflict**: `{ "message": "Action not allowed in current state." }`
- **500 Server Error**: `{ "message": "Server Error" }`

---

## 2. Status Separation & Lifecycle

### Order Statuses
- `pending`, `confirmed`, `in_production`, `ready`, `completed`, `cancelled`

### Production Statuses
- `measurements_received`, `measurements_approved`, `material_ready`, `sourcing`, `cutting`, `sewing`, `finishing`, `quality_check`, `ready`

### Fulfillment Statuses
- `pending`, `ready_for_pickup`, `out_for_delivery`, `delivered`, `picked_up`, `failed`, `cancelled`

### Quote Statuses
- `draft`, `sent`, `accepted`, `rejected`, `expired`, `cancelled`

---

## 3. End-to-End Business Workflows

### Flow A: "I WANT THIS" (Existing Style)
1. Customer browses Styles.
2. Selects Style → `POST /api/v1/conversations` (context: `style`). Backend reuses existing conversation if one exists.
3. Customer adds Measurements / Discusses Material.
4. Admin creates Quote (`draft`). Admin sends Quote (`sent`).
5. Customer accepts Quote (`accepted`). **Order automatically generated with historical snapshot.**
6. Customer initiates Payment (Deposit/Full). Webhook verifies success.
7. Order moves to `confirmed` → Production updates → Fulfillment → `completed`.

### Flow B: Customer Inspiration ("SHOW US YOUR STYLE")
1. Customer uploads attachments via `POST /api/v1/attachments`.
2. Submits `POST /api/v1/style-requests`.
3. Opens Conversation with context `style_request`.
4. Process merges with Flow A from step 3.

---

## 4. Endpoints by Domain

### 4.1 Authentication

#### Register
- **Method / URI**: `POST /api/v1/auth/register`
- **Authentication**: None
- **Role**: None
- **Request Body**: `name`, `email`, `password`, `password_confirmation`
- **Validation**: `email` unique, password confirmed.
- **Response**: `201 Created`. User object + `token`.
- **Errors**: 422 Validation.

#### Login
- **Method / URI**: `POST /api/v1/auth/login`
- **Authentication**: None
- **Request Body**: `email`, `password`
- **Validation**: Valid credentials.
- **Response**: `200 OK`. User object + `token`.
- **Errors**: 422 Validation, 401 Unauthorized (Invalid credentials).

#### Current User
- **Method / URI**: `GET /api/v1/auth/me`
- **Authentication**: Required
- **Role**: Any
- **Response**: `200 OK`. User profile including `role`.

#### Logout
- **Method / URI**: `POST /api/v1/auth/logout`
- **Authentication**: Required
- **Response**: `204 No Content`. Revokes token.

### 4.2 Styles (Discovery)

#### List Categories / Collections
- **Method / URI**: `GET /api/v1/categories` | `GET /api/v1/collections`
- **Authentication**: None
- **Response**: `200 OK`. List of categories/collections.

#### List / Search Styles
- **Method / URI**: `GET /api/v1/styles`
- **Authentication**: None
- **Query Params**: `category_slug`, `collection_slug`, `is_featured`, standard pagination/search.
- **Business Rule**: Returns only `is_published=true` styles (unless authenticated as admin).
- **Relationships**: `images` (`is_primary=true`), `category`, `collection`.
- **Response**: `200 OK`. Paginated `Style` models. Response includes `is_saved` boolean indicating if the authenticated user has saved the style (defaults to false for guests).

#### Style Details
- **Method / URI**: `GET /api/v1/styles/{slug}`
- **Authentication**: None
- **Response**: `200 OK`. Single `Style` model with all `images`. Includes `is_saved` boolean for the authenticated user.
- **Errors**: 404 Not Found (or if unpublished and not admin).

#### Save / Unsave Style
- **Method / URI**: `POST /api/v1/styles/{id}/save` | `DELETE /api/v1/styles/{id}/save`
- **Authentication**: Required
- **Role**: `customer`
- **Validation**: `id` must exist.
- **Response**: `200 OK`. Toggles saved state.

#### Get Saved Styles
- **Method / URI**: `GET /api/v1/saved-styles`
- **Authentication**: Required
- **Role**: `customer`
- **Query Params**: `search`, standard pagination/sort.
- **Authorization**: Customer only retrieves their own saved styles.
- **Response**: `200 OK`. Paginated `Style` models that have been saved by the authenticated user. Each style includes `is_saved: true`.

### 4.3 Materials

#### List Materials
- **Method / URI**: `GET /api/v1/materials`
- **Authentication**: None
- **Query Params**: `type`, standard pagination/search.
- **Response**: `200 OK`. Paginated `Material` models with primary image.

#### Material Details
- **Method / URI**: `GET /api/v1/materials/{id}`
- **Authentication**: None
- **Response**: `200 OK`. Single `Material` with images.

### 4.4 Style Requests & Attachments

#### Attachment Security & Upload
- **Method / URI**: `POST /api/v1/attachments`
- **Authentication**: Required
- **Request Body**: `file` (multipart)
- **Validation**: `mimes:jpeg,png,jpg,pdf`, max size `10MB`.
- **Business Rules**: Files stored securely in Supabase Storage. PostgreSQL stores metadata. Cleanup jobs will purge unlinked attachments older than 24h. Customer only owns files they uploaded.
- **Response**: `201 Created`. Attachment metadata including `id`.

#### Create Style Request
- **Method / URI**: `POST /api/v1/style-requests`
- **Authentication**: Required
- **Role**: `customer`
- **Request Body**: `description` (required), `preferred_color`, `preferred_material`, `style_id` (optional reference), `attachments` (array of attachment IDs).
- **Validation**: Provided `attachments` IDs must belong to the authenticated user and not be linked to other entities.
- **Authorization**: Only the owner of attachments can link them.
- **State Transition**: Creates request with `status="pending"`.
- **Response**: `201 Created`. `StyleRequest` object.

#### List Style Requests
- **Method / URI**: `GET /api/v1/style-requests`
- **Authentication**: Required
- **Role**: `customer` (sees own) / `admin` (sees all)
- **Response**: `200 OK`. Paginated `StyleRequest`s with `attachments`.

### 4.5 Conversations & Messages

#### Create / Open Conversation
- **Method / URI**: `POST /api/v1/conversations`
- **Authentication**: Required
- **Role**: `customer`
- **Request Body**: `context_type` (`style`, `style_request`, `order`), `context_id` (uuid).
- **Authorization**: Customer can only pass `context_id` for entities they own (Order, Style Request) or globally published entities (Style).
- **Business Rule**: "I WANT THIS" flow. Reuses existing matching conversation if one already exists for this exact user + context.
- **Response**: `200 OK` (if existing) or `201 Created`. `Conversation` object.

#### List Conversations
- **Method / URI**: `GET /api/v1/conversations`
- **Authentication**: Required
- **Role**: `customer` (own) / `admin` (all)
- **Relationships**: Eager loads `latest_message`.
- **Response**: `200 OK`. Paginated list ordered by `updated_at` descending. Each conversation object contains `updated_at` and `latest_message` (using the Message resource format).

#### Read Conversation & List Messages
- **Method / URI**: `GET /api/v1/conversations/{id}/messages`
- **Authentication**: Required
- **Authorization**: Customer must own the conversation; Admin has global access.
- **Response**: `200 OK`. Paginated `Message` array ascending, with polymorphic `attachments`.

#### Send Message
- **Method / URI**: `POST /api/v1/conversations/{id}/messages`
- **Authentication**: Required
- **Request Body**: `body` (text, nullable), `attachments` (array of attachment IDs, nullable).
- **Validation**: At least one must be provided. Attachments must belong to the user.
- **Response**: `201 Created`. `Message` object.

### 4.6 Measurements

#### List Measurement Profiles
- **Method / URI**: `GET /api/v1/measurement-profiles`
- **Authentication**: Required
- **Role**: `customer`
- **Response**: `200 OK`. List of profiles including latest `sets`.

#### Submit Measurements (Create Versioned Set)
- **Method / URI**: `POST /api/v1/measurement-profiles/{id}/sets`
- **Authentication**: Required
- **Authorization**: Customer must own the `MeasurementProfile`. Admins can submit on behalf of customers.
- **Request Body**: `notes`, `values` (array of key, value, unit).
- **Business Rule**: Historical sets are strictly preserved. The API automatically increments the `version` counter and creates a new `measurement_set` + `measurement_values`.
- **State Transition**: Set created as `is_approved=false`.
- **Response**: `201 Created`. `MeasurementSet`.

#### Approve Measurements
- **Method / URI**: `POST /api/v1/measurement-sets/{id}/approve`
- **Authentication**: Required
- **Role**: `admin`
- **State Transition**: `is_approved=true`.
- **Response**: `200 OK`.

### 4.7 Quotes

#### Create Quote (Draft)
- **Method / URI**: `POST /api/v1/quotes`
- **Authentication**: Required
- **Role**: `admin`
- **Request Body**: `user_id`, `conversation_id`, `notes`, `expires_at`, `items` (array).
- **Business Rule**: All prices in minor units. API computes subtotals/totals.
- **State Transition**: `status` set to `draft`.
- **Response**: `201 Created`.

#### Send Quote
- **Method / URI**: `POST /api/v1/quotes/{id}/send`
- **Authentication**: Required
- **Role**: `admin`
- **State Transition**: Transitions `draft` to `sent`. Triggers notification.
- **Response**: `200 OK`.

#### Accept Quote
- **Method / URI**: `POST /api/v1/quotes/{id}/accept`
- **Authentication**: Required
- **Role**: `customer` (owner)
- **Validation**: Fails if quote is expired, rejected, or already accepted.
- **State Transition**: `status` set to `accepted`.
- **Historical Snapshot Rule**: Automatically generates an `Order`. The `snapshot` JSON column in `orders` locks in: style identity, customization notes, material name, measurement snapshot values, and agreed pricing, guaranteeing future profile changes do not rewrite historical order facts.
- **Response**: `201 Created`. Returns the generated `Order` object.

### 4.8 Payments

#### Initialize Payment
- **Method / URI**: `POST /api/v1/orders/{id}/payments`
- **Authentication**: Required
- **Role**: `customer`
- **Request Body**: `amount` (minor units), `type` (deposit, balance, full).
- **Validation**: Backend calculates total order cost vs already paid. Validates minimum deposit thresholds, prevents overpayment, blocks duplicate pending attempts, checks if order is cancelled. Amount strictly evaluated by backend.
- **Response**: `201 Created`. Returns `Payment` intent metadata and provider link/reference.

#### Provider Webhook (Security Authority)
- **Method / URI**: `POST /api/v1/payments/webhook/{provider}`
- **Authentication**: Provider Webhook Signature validation.
- **Role**: System
- **Business Rule**: Client/frontend is NEVER the authority for payment success. The provider webhook acts as the sole source of truth.
- **State Transitions**: Validates signature, finds payment by reference, updates payment status to `successful`. Transitions `Order` status to `confirmed` if deposit/full thresholds are met.
- **Response**: `200 OK`.

#### Verify Payment (Client Polling/Callback)
- **Method / URI**: `POST /api/v1/payments/{id}/verify`
- **Authentication**: Required
- **Role**: `customer` / `admin`
- **Business Rule**: Does not trust client-supplied references. Forces the backend to query the provider API (e.g., Paystack/Flutterwave) to fetch the actual status and synchronize state.
- **Response**: `200 OK`. Syncs and returns updated Payment/Order state.

### 4.9 Orders

#### List Orders / Details
- **Method / URI**: `GET /api/v1/orders` | `GET /api/v1/orders/{id}`
- **Authentication**: Required
- **Authorization**: `customer` (owner) / `admin` (all).
- **Relationships**: `quote`, `payments`, `productionUpdates`, `fulfillment`. Contains historical `snapshot`.
- **Response**: `200 OK`.

### 4.10 Production

#### Log Production Update
- **Method / URI**: `POST /api/v1/orders/{id}/production-updates`
- **Authentication**: Required
- **Role**: `admin`
- **Request Body**: `status` (measurements_received, cutting, sewing, ready, etc.), `note`, `attachments`.
- **Business Rule**: Explicitly disjointed from Fulfillment statuses. Attachments linked via polymorphic table.
- **Response**: `201 Created`.

#### List Production Updates
- **Method / URI**: `GET /api/v1/orders/{id}/production-updates`
- **Response**: `200 OK`. Array of updates (progress feed for customer).

### 4.11 Fulfillment

#### Add / Update Fulfillment
- **Methods**: 
  - `POST /api/v1/orders/{id}/fulfillment` (Create)
  - `PATCH /api/v1/orders/{id}/fulfillment` (Update)
- **Authentication**: Required
- **Role**: `admin`
- **Request Body**: `type` (pickup, delivery), `recipient_name`, `phone`, `address`, `delivery_fee` (minor units), `tracking_reference`, `status` (pending, out_for_delivery, delivered, etc.).
- **Validation**: If `type=delivery`, `address` and `recipient_name` are required. If `type=pickup`, `address` is optional/ignored.
- **Response**: `200/201`. `Fulfillment` record.

#### Get Fulfillment
- **Method / URI**: `GET /api/v1/orders/{id}/fulfillment`
- **Response**: `200 OK`. Fulfillment object.

### 4.12 Notifications

#### List & Read
- **Method / URI**: `GET /api/v1/notifications`
- **Method / URI**: `POST /api/v1/notifications/{id}/read`
- **Method / URI**: `POST /api/v1/notifications/read-all`
- **Response**: `200 OK`. Standard Laravel notification payloads.
