# KINGJOEBRIDD Frontend Integration Architecture

This document defines the final Next.js frontend integration architecture, mapping the approved product design and API contract to actionable frontend modules, types, and workflows.

## 1. Frontend/Backend Boundary

The boundary is strictly decoupled:
**Next.js 16.3.4 (App Router Frontend) → Laravel 13.31.0 (Backend API v1) → PostgreSQL/Supabase (Database)**

- The frontend **NEVER** connects directly to the database.
- The frontend **NEVER** processes payments directly; it only initializes them via Laravel and reads the webhook-verified status.
- The frontend **NEVER** handles its own separate business logic for orders, quotes, or status transitions.
- The frontend interacts exclusively via `/api/v1/...` (or production URL) using JSON and Bearer tokens.

## 2. API Client Architecture (`apiClient.ts`)

The `apiClient.ts` handles API requests securely:
1. **Bearer Token Injection**: It automatically retrieves the Sanctum Bearer token (from cookies) and injects `Authorization: Bearer <token>`.
2. **Multipart/FormData Support**: It intelligently omits `Content-Type: application/json` when the body is an instance of `FormData` (used for Attachments).
3. **Structured Error Handling**: Handles Laravel validation errors and authentication redirects robustly.

## 3. API Modules Structure

API calls are structured by domain in `frontend/lib/api/`:

```text
frontend/lib/api/
├── apiClient.ts          # The core fetch wrapper
├── auth.ts               # login, register, logout, me
├── styles.ts             # getStyles, getStyle, saveStyle
├── materials.ts          # getMaterials, getMaterial
├── styleRequests.ts      # createStyleRequest, getStyleRequests
├── conversations.ts      # createConversation, getConversations, getMessages, sendMessage
├── attachments.ts        # uploadAttachment
├── measurements.ts       # getProfiles, submitMeasurements
├── quotes.ts             # acceptQuote
├── payments.ts           # initializePayment, verifyPayment
└── orders.ts             # getOrders, getOrder, getProductionUpdates, upsertFulfillment
```

## 4. Authentication Architecture

**Mechanism**: Laravel Sanctum Bearer Tokens.
**Storage**: Next.js Cookies.
- Using cookies ensures that Next.js Server Components can read the token and pre-fetch data securely on the server.
- On login (`POST /api/v1/auth/login`), Laravel returns a `{ token, user }`.
- The frontend sets the token in a cookie.
- The `apiClient` reads this cookie for every subsequent request.
- Unauthenticated users are strictly guarded from accessing protected routes (`/account`, `/admin`) via middleware.

## 5. Type Architecture

The `frontend/types/api.ts` file strictly matches Laravel's API Resources.

```typescript
export interface User { id: string; name: string; email: string; role: 'customer' | 'admin'; }
export interface Quote { id: string; status: 'draft' | 'sent' | 'accepted' | 'expired'; total: number; }
export interface Order { 
  id: string; 
  payment_status: 'pending_payment' | 'partially_paid' | 'paid_in_full'; 
  production_status: 'not_started' | 'cutting' | 'sewing' | 'finishing' | 'quality_check' | 'ready'; 
}
export interface Fulfillment { 
  id: string; 
  type: 'pickup' | 'delivery'; 
  status: 'pending' | 'shipped' | 'ready_for_pickup' | 'delivered' | 'picked_up'; 
}
```

## 6. Business Workflow Integration

### Flow A: "I WANT THIS" (Existing Style)
1. **UI**: `/styles/[slug]` → Click "I WANT THIS".
2. **API**: `POST /api/v1/conversations` with `{ contextable_type: 'style', contextable_id: '<style_id>' }`.
3. **UI State**: Navigate to `/chat/[conversation_id]`. 

### Flow B: "SHOW US YOUR STYLE" (Inspiration)
1. **UI**: `/style-requests/new` → Upload images.
2. **API**: `POST /api/v1/attachments` (multipart/form-data). Store returned `id`s.
3. **API**: `POST /api/v1/style-requests` with `{ description, attachments: [...] }`.
4. **API**: `POST /api/v1/conversations` with `{ contextable_type: 'style_request', contextable_id: '<request_id>' }`.

### Quote & Order Lifecycle
1. Admin creates Quote (`/admin/quotes/new`).
2. Admin sends Quote. Quote status becomes `sent`.
3. Customer receives notification and accepts Quote (`/account/quotes/[id]`). 
4. The system automatically converts the accepted Quote into a new Order.
5. Customer proceeds to `/account/orders/[id]/pay` to process the payment.
6. Admin updates Production milestones in `/admin/orders/[id]`.
7. Once Production is `ready`, Fulfillment is tracked natively.

## 7. Protected Routing

**Customer Routes** (`/account/*`):
- `/account/orders`
- `/account/quotes`
- `/account/requests`
- `/account/measurements`
- `/account/conversations`
- `/account/styles`

**Admin Routes** (`/admin/*`):
- Full CRUD tools parallel to the customer routes, with complete management powers and strict Laravel `403` enforcement.

## 8. Attachment Handling

- **Endpoint**: `POST /api/v1/attachments`
- **Handling**: Attachments must be uploaded *first* before the parent record (Message, StyleRequest) is created. The frontend waits for the `201 Created` response to get the attachment `id`, then passes that `id` into the subsequent JSON payload.

## 9. Error Handling & Pagination

- **Pagination**: The frontend consumes `data` and `meta` from Laravel's PaginatedResource responses, handling dynamic UI pagination intuitively.
- **Error Handling**: React to Laravel `422` errors with inline form validation, and `500` errors globally. Never expose raw exceptions.

## 10. Conclusion

The Next.js App Router integrates cleanly with the Laravel backend. Production workflows, orders, and stylistic direction map successfully. The architecture is deployed and fully complete.
