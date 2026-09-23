# Phase 3 — Customer Engagement Architecture & Implementation Plan

## 1. Current Architecture Audit

- **Backend API**: The Laravel v1.1 API fully supports Style Requests, Attachments, Conversations, and Messages. It properly enforces authorization (customers only access their own entities) and defines polymorphic structures to relate conversations to specific styles or style requests.
- **Frontend Foundation**: Next.js 16.3.4 App Router, robust secure authentication (HTTP-only `kb_session`), global API client (`apiClient.ts`), and the centralized `api.ts` types are in place.
- **Phase 2 Implementation**: "I WANT THIS" currently exists. However, Phase 2 incorrectly assumed the payload keys were `contextable_type`. The actual API requires `context_type` and `context_id`. This must be corrected during Phase 3 integration.
- **Account Navigation**: Exists at `frontend/app/(customer)/account/layout.tsx`. 

## 2. Phase 3 Goals

Build the crucial engagement layer separating KINGJOEBRIDD from standard ecommerce:
1. **Context-Rich Communication**: Allow customers to discuss specific bespoke creations with tailors via an elegant, simple messaging interface.
2. **Style Requests**: Enable users to upload their own inspirations and start a consultation via a "SHOW US YOUR STYLE" flow.
3. **Seamless Attachment Handling**: Securely upload and associate images to requests and messages, relying purely on the Laravel backend for cloud storage operations.
4. **Mobile-First UX**: The messaging interface must feel native and luxurious on mobile devices.

## 3. User Journeys

### FLOW A — I WANT THIS
1. Customer clicks "I WANT THIS" on a Style Detail page.
2. The frontend triggers `POST /api/v1/conversations` with `context_type: "style"` and `context_id`. 
3. Backend creates or **returns the existing** conversation for that exact style and user.
4. Customer is navigated to `/account/conversations/{id}`.
5. The Conversation Detail view clearly displays the Style context (image/name) prominently at the top.
6. Customer sends their message.

### FLOW B — SHOW US YOUR STYLE
1. Customer clicks "SHOW US YOUR STYLE".
2. Customer is routed to `/style-requests/new`.
3. Customer uploads inspiration images (triggering `POST /api/v1/attachments` immediately for each file, returning `id`s).
4. Customer fills out title, description, and budget range.
5. Form submission triggers `POST /api/v1/style-requests` containing `attachment_ids`.
6. Success routes the user to `POST /api/v1/conversations` with `context_type: 'style_request'`, navigating them to the new conversation.

## 4. Page / Route Architecture

- `/style-requests/new` - Public-facing (but auth-protected) form for submitting custom inspirations.
- `/account/requests` - List of customer's submitted custom style requests.
- `/account/requests/[id]` - Detail view of a specific style request (read-only snapshot).
- `/account/conversations` - List view of all active conversations.
- `/account/conversations/[id]` - Active chat interface for a specific context.

## 5. Component Architecture

- `AttachmentUploader`: Reusable component handling file selection, progress tracking, and calling `POST /api/v1/attachments`. Must preserve successfully uploaded IDs across form retries to prevent duplicate uploads.
- `ConversationList`: Displays recent conversations.
- `ConversationHeader`: Displays the contextual business entity (Style or Style Request) at the top of the chat.
- `MessageFeed`: Renders chronological list of messages.
- `MessageComposer`: Fixed-bottom input area supporting multi-line text and attachments.
- `ContextBanner`: A visual summary block for the active context.

## 6. API Integration

Endpoints utilized from the existing API contract:
1. `POST /api/v1/attachments` (multipart/form-data)
2. `POST /api/v1/style-requests`
3. `GET /api/v1/style-requests`
4. `POST /api/v1/conversations`
5. `GET /api/v1/conversations`
6. `GET /api/v1/conversations/{id}/messages`
7. `POST /api/v1/conversations/{id}/messages`

## 7. Type Architecture (Verified against actual API)

```typescript
interface Attachment { id: string; file_name: string; file_type: string; file_size: number; url: string; created_at: string; }
interface StyleRequest { id: string; status: string; title: string; description: string; budget_range: string | null; attachments: Attachment[]; created_at: string; }
interface Conversation { id: string; user_id: string; context_type: 'style' | 'style_request' | 'order'; context_id: string; status: string; messages?: Message[]; created_at: string; }
interface Message { id: string; sender_id: string; is_read: boolean; content: string; attachments: Attachment[]; created_at: string; }
```

## 8. State Management

- **Conversations & Requests Lists**: Server Components (RSC) fetching initial data, passed to Client Components for load-more logic.
- **Active Chat (`/account/conversations/[id]`)**: Client Component managing a `messages` array in React state.
- **Message Sending**: Optimistic UI appending while awaiting `POST` success.
- **Attachment Uploads**: The component must hold `attachment_ids` in state. If a final submission fails (e.g., 422 error), the IDs are preserved in state so the user doesn't have to re-upload.

## 9. Attachment Architecture

1. User selects file.
2. `AttachmentUploader` immediately uploads via `POST /api/v1/attachments`.
3. Backend securely assigns `user_id` based on Sanctum auth token (Client cannot spoof this).
4. On 201 Created, the returned `id` is pushed to local state.
5. User submits form/message with `attachment_ids`.
6. Backend enforces ownership: `Attachment::whereIn('id', $validated['attachment_ids'])->where('user_id', '!=', $request->user()->id)->exists()`.

## 10. Conversation Architecture

- **Reuse**: Driven entirely by Laravel. The frontend blindly submits `POST /api/v1/conversations` with `context_type` and `context_id`. Laravel's `ConversationController` handles the deduplication and returns `200 OK` if reusing or `201 Created` if new.
- **Context display**: If `context_type === 'style'`, we fetch the Style to render a banner.

## 11. Polling Requirements

- **Method**: Standard HTTP polling (`setInterval` + `fetch/apiClient`).
- **Interval**: ~5 seconds.
- **Rules**:
  - Poll only while the active conversation is mounted.
  - Clean up the polling timer on unmount.
  - Track inflight requests to prevent overlapping/duplicate fetches.
  - Stop or drastically reduce polling when `document.visibilityState !== 'visible'`.
  - Check the latest fetched message against existing state to prevent duplicate rendering.
  - Preserve scroll position when new messages arrive without force-scrolling the customer away if they are reading older history.

## 12. Responsive Strategy

- **Desktop**: Split pane view (Conversations list on left, Active chat on right) within the Account layout.
- **Mobile**: Distinct pages. Tapping a conversation in the list navigates to the active chat full-screen, hiding the account sidebar. The `MessageComposer` relies on `dvh` (dynamic viewport height).

## 13. Accessibility

- `aria-live="polite"` on the message feed so screen readers announce new incoming messages.
- Full keyboard navigation for the `AttachmentUploader` and `MessageComposer`.

## 14. Implementation Phases

- **Phase 3.1**: API/types foundation (Create `conversations.ts`, `styleRequests.ts`, `attachments.ts`).
- **Phase 3.2**: Attachment UI & Upload logic.
- **Phase 3.3**: "SHOW US YOUR STYLE" entry & Style Request form (`/style-requests/new`).
- **Phase 3.4**: Conversation list UI (`/account/conversations`).
- **Phase 3.5**: Conversation detail UI & Message Feed (`/account/conversations/[id]`).
- **Phase 3.6**: Message Composer & Polling implementation.
- **Phase 3.7**: Update Phase 2 "I WANT THIS" payload (`context_type` instead of `contextable_type`).
- **Phase 3.8**: Account integration.

## 15. API Verification

- **Conversation Response**: Returns `context_type` and `context_id` (not `contextable_*`), plus `user_id` and `messages`.
- **Message Response**: Returns `content` (mapped from `body`), `is_read` (mapped from `read_at`), and `sender_id`.
- **Attachment Response**: Returns `file_name`, `file_type`, `file_size`, and `url`.
- **Style Request Response**: Expects and returns `title`, `description`, `budget_range`, `status`, and `attachments`.
- **Ownership/Security**: `AttachmentController` strictly ignores client `user_id` and securely assigns the authenticated user. `MessageController` and `StyleRequestController` perform an `exists()` check to guarantee the user owns the attached IDs before committing the transaction.
- **Deduplication**: `ConversationController` handles `I WANT THIS` deduplication flawlessly based on `user_id`, `contextable_type`, and `contextable_id` matching.

## 16. Confirmed API Gaps

- **Message Read State**: While the `MessageResource` exposes an `is_read` boolean derived from the model's `read_at` timestamp, there is currently **no endpoint** (e.g., `POST /api/v1/messages/{id}/read`) to actually update this state in the database. 
  - *Frontend Mitigation*: The frontend will not invent read receipts. Messages will render correctly but we will simply not track unread counts or trigger read status until the backend implements the required route.
- **Conversation Latest Message**: `ConversationResource` does not eagerly load or expose `latest_message` or `updated_at` explicitly, which makes sorting a conversation list by recent activity difficult without loading all messages for every conversation.

**PHASE 3 API VERIFICATION COMPLETE — READY FOR IMPLEMENTATION REVIEW**
