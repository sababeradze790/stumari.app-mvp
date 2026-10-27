# Security & Multi-Tenant Architecture Hardening Plan (Phase 1 & Phase 2)

A production-grade security and multi-tenant isolation blueprint for Stumari that enforces host data separation, protects residential access credentials (door/lockbox codes), and prevents cross-tenant data leaks, while ensuring 100% backward compatibility for existing published guides, printed QR stands, and NFC chips.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> **Zero Code/Rule Modification Confirmation**: This plan is presented in STRICT READ-ONLY inspection mode. No production Firestore rules have been deployed, no source files modified, and no database records altered. Execution will begin only upon your explicit approval.

- **Critical Decision 1 (Door Code Protection)**:
  - *Option A (Recommended - Segregated Access Model)*: Keep published guide public for marketing, photos, Wi-Fi, rules, and how-tos, but isolate door codes/lockbox pins so they are only returned to verified guest sessions or authenticated owners.
  - *Option B (Open Guide Model)*: Leave door codes readable within published guides for seamless 1-tap arrival, but restrict access strictly so unpublished drafts and collection-wide queries cannot be read.
  - *Recommendation*: Option A for long-term safety, or Option B as an immediate Phase 1 milestone if hosts require zero-friction guest check-in without verification codes.
- **Critical Decision 2 (Demo Host Account Isolation)**:
  - *Decision*: Remove hardcoded `isDemoOwner` rules (`'demo-host-uid'`, `'host-user-1'`) from production Firestore rules. Demo interactions will operate purely in-memory using client-side mock state, preventing unauthenticated external users from modifying live cloud data.

---

## 1. Inspection Findings & Current System Posture

The following facts were verified through direct read-only inspection of the repository, environment configurations, and source code.

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                                STUMARI ENVIRONMENT AUDIT                                │
├────────────────────────────────┬─────────────────────────────────────────────────────────┤
│ Verification Item              │ Verified Status & Details                               │
├────────────────────────────────┼─────────────────────────────────────────────────────────┤
│ 1. Git Status & Uncommitted    │ [VERIFIED FACT] No .git repository exists in workspace; │
│                                │ all modifications are tracked by container state only. │
├────────────────────────────────┼─────────────────────────────────────────────────────────┤
│ 2. Firebase IDs & Buckets      │ [VERIFIED FACT] Project ID: decent-copilot-rn2tx       │
│                                │ Firestore DB: ai-studio-stumari-77952b8f-69ff-4d4b-     │
│                                │               bcc9-feed4c1c3264                         │
│                                │ Storage Bucket: decent-copilot-rn2tx.firebasestorage.app│
├────────────────────────────────┼─────────────────────────────────────────────────────────┤
│ 3. Currently Deployed Rules    │ [VERIFIED FACT] firestore.rules has allow read: if true;│
│                                │ for /properties, /feedbacks, /requests. Hardcoded demo  │
│                                │ bypasses exist. storage.rules is MISSING from repo.     │
├────────────────────────────────┼─────────────────────────────────────────────────────────┤
│ 4. Property Ownership & Auth   │ [VERIFIED FACT] Client filters in-memory only. Auth is  │
│                                │ Firebase Auth (Email/Pass + Google). When unauth,       │
│                                │ ownerId defaults to 'host-user-1' or 'demo-host-uid'.   │
├────────────────────────────────┼─────────────────────────────────────────────────────────┤
│ 5. Data Structures             │ [VERIFIED FACT] /properties holds doorKeypadCode,       │
│                                │ lockboxCode, wifiPassword alongside public fields.      │
│                                │ /requests and /feedbacks lack hostId indexing.          │
├────────────────────────────────┼─────────────────────────────────────────────────────────┤
│ 6. QR Codes, NFC & URLs        │ [VERIFIED FACT] URLs use format /#/g/{property.slug}.   │
│                                │ Backwards compatibility requires slug-based fetching.  │
├────────────────────────────────┼─────────────────────────────────────────────────────────┤
│ 7. Backup & Recovery           │ [VERIFIED FACT] In-repo seed data exists in mockData.ts │
│                                │ and localStorage. Cloud PITR/backups CANNOT be verified │
│                                │ from container without GCP IAM / gcloud credentials.    │
└────────────────────────────────┴─────────────────────────────────────────────────────────┘
```

### Verified Facts vs. Assumptions

#### Verified Facts
1. **Unbounded Firestore Listeners**: `src/context/AppContext.tsx` invokes `onSnapshot(collection(db, 'properties'))`, `onSnapshot(collection(db, 'feedbacks'))`, and `onSnapshot(collection(db, 'requests'))`. Every connected client streams every property, guest request, and review across all hosts.
2. **Plaintext Credential Exposure**: `doorKeypadCode`, `lockboxCode`, and `wifiPassword` are stored at root of `/properties/{id}` documents. With `allow read: if true;`, any unauthenticated client can retrieve all door codes across the entire database.
3. **Hardcoded Demo Backdoors**: `firestore.rules` lines 10–12 define `isDemoOwner(ownerId)` which allows unauthenticated mutations if `isDemo == true` or `ownerId == 'host-user-1'`.
4. **Storage Rules Missing**: `storage.rules` does not exist in the project repository. Media is uploaded to generic paths (`properties/howto-videos/...`).
5. **Route Structures**: QR codes, NFC tags, and share links generate URLs formatted as `${window.location.origin}/#/g/${property.slug}`.

#### Assumptions & Unverifiable Areas
1. **Cloud Project-Level Backups**: Point-in-time recovery (PITR) or automated Cloud Storage exports for Firestore in `decent-copilot-rn2tx` **cannot be verified** without GCP Cloud Console / IAM access. We must assume cloud backups are not configured and take defensive measures.
2. **Currently Active Storage Rules in GCP**: Because `storage.rules` is not in the repository, Firebase Storage in production is either running default 30-day trial rules or closed rules.
3. **Historical Document Schemas**: Older documents in the live Firestore database may lack the `status` or `ownerId` fields, which requires safe fallback migration during read/write operations.

---

## 2. Technical Architecture & Data Strategy

```
CURRENT VULNERABLE ARCHITECTURE:
  [Any Client / Scraper] ───────────► onSnapshot(collection('properties')) ─────► ALL Properties & Door Codes
  [Host A / Host B]      ───────────► onSnapshot(collection('requests'))   ─────► ALL Guest Maintenance Requests
  [Any Visitor]          ───────────► onSnapshot(collection('feedbacks'))  ─────► ALL Private Guest Feedback

TARGET HARDENED MULTI-TENANT ARCHITECTURE:
  ┌───────────────────┐
  │ Authenticated Host│──► query('properties', where('ownerId', '==', uid)) ────► Only Own Properties & Drafts
  │                   │──► query('requests', where('hostId', '==', uid))   ────► Only Own Guest Requests
  │                   │──► query('feedbacks', where('hostId', '==', uid))  ────► Only Own Stay Reviews
  └───────────────────┘
  ┌───────────────────┐
  │ Guest (QR / NFC)  │──► query('properties', where('slug', '==', slug),
  │                   │                        where('status', '==', 'published'),
  │                   │                        limit(1))                   ────► Targeted Single Guide
  └───────────────────┘
  ┌───────────────────┐
  │ Guest Requests    │──► addDoc('requests', { propertyId, hostId, ... }) ────► Create-Only (No Global List)
  │ Guest Reviews     │──► addDoc('feedbacks', { propertyId, hostId, ... })────► Create-Only (No Global List)
  └───────────────────┘
```

---

## 3. File-by-File Implementation Plan

### Phase 1: Security Rules & Storage Hardening

#### File 1: `firestore.rules`
* **Changes**:
  1. Remove `isDemoOwner` function and all unauthenticated bypass rules (`isDemo == true`).
  2. Implement helper functions:
     - `isAuthenticated()`: `request.auth != null`
     - `isOwner(userId)`: `request.auth != null && request.auth.uid == userId`
     - `isPropertyOwner(propertyId)`: Checks if `request.auth.uid == resource.data.ownerId`
  3. Harden `/properties/{propertyId}`:
     - **Read**: Allow single document `get` if `resource.data.status == 'published'` OR `isOwner(resource.data.ownerId)`.
     - **List (Query)**: Allow queries where `resource.data.status == 'published'` OR where `resource.data.ownerId == request.auth.uid`.
     - **Create**: Allow if `isOwner(request.resource.data.ownerId)`.
     - **Update/Delete**: Allow if `isOwner(resource.data.ownerId)` and preventing `ownerId` tampering.
  4. Harden `/requests/{requestId}`:
     - **Read / List**: Allow only if `isOwner(resource.data.hostId)`. Deny public listing.
     - **Create**: Allow unauthenticated guests to create requests, validating that required fields (`propertyId`, `hostId`, `category`, `title`) are provided and status is initialized to `'new'`.
     - **Update**: Allow if `isOwner(resource.data.hostId)` to update ticket status (`'in_progress'`, `'resolved'`).
     - **Delete**: Allow only if `isOwner(resource.data.hostId)`.
  5. Harden `/feedbacks/{feedbackId}`:
     - **Read / List**: Allow only if `isOwner(resource.data.hostId)`.
     - **Create**: Allow unauthenticated guests to submit feedback, validating sentiment and propertyId.
     - **Update/Delete**: Allow only if `isOwner(resource.data.hostId)`.
  6. Secure `/users/{userId}`: Strict owner read/write (`request.auth.uid == userId`).

#### File 2: `storage.rules` (New File)
* **Changes**:
  1. Create standard Firebase Storage rules file.
  2. Restrict uploads to authenticated hosts under `hosts/{userId}/{allPaths=**}`:
     - Size limit: 25MB maximum per video, 5MB per photo.
     - Content-Type: `request.resource.contentType.matches('image/.*|video/.*')`.
  3. Public read allowed for published property media assets.

---

### Phase 2: Client Query Refactoring & Backward-Compatible Guest Routing

#### File 3: `src/context/AppContext.tsx`
* **Changes**:
  1. **Scoped Host Properties Listener**:
     - When `firebaseUser` is authenticated, replace `collection(db, 'properties')` with:
       ```typescript
       query(collection(db, 'properties'), where('ownerId', '==', firebaseUser.uid))
       ```
     - When unauthenticated (demo mode), populate properties from `INITIAL_PROPERTIES` in local memory without querying Firestore, preventing permission rejections.
  2. **Scoped Operational Listeners**:
     - Listen to `/requests` filtered by `where('hostId', '==', firebaseUser.uid)`.
     - Listen to `/feedbacks` filtered by `where('hostId', '==', firebaseUser.uid)`.
  3. **Guest Guide Single-Property Fetcher**:
     - Introduce `fetchGuestPropertyBySlug(slug: string)`:
       ```typescript
       query(collection(db, 'properties'), where('slug', '==', slug), where('status', '==', 'published'), limit(1))
       ```
     - Caches active property in memory and offline storage (`localStorage`), ensuring instant load on repeat visits.
  4. **Host ID Denormalization**:
     - When creating guest requests (`addGuestRequest`) and feedback (`addStayFeedback`), automatically include `hostId: currentProperty.ownerId` so rules can verify tenancy on writes.

#### File 4: `src/components/guest/GuestGuideSimple.tsx`
* **Changes**:
  1. Detect property from URL slug or ID dynamically: if not present in local state, trigger `fetchGuestPropertyBySlug(slug)`.
  2. Display loading skeleton during initial load for cold guest visits.
  3. Maintain 100% compatibility with all existing NFC chips and printed QR stands.

#### File 5: `src/components/host/HostDashboardSimple.tsx`
* **Changes**:
  1. Remove client-side `.filter(p => p.ownerId === ...)` now that server-side Firestore query returns strictly owned properties.
  2. Ensure zero UI layout shifts or broken metrics.

#### File 6: `src/components/admin/AdminConsole.tsx`
* **Changes**:
  1. Add an administrative guard: verify `auth.currentUser?.email` or role before rendering admin metrics and controls.
  2. Redirect unauthorized users to `/app` with a security toast notification.

#### File 7: `src/data/mockData.ts` & Local Demo State
* **Changes**:
  1. Update demo properties so they remain self-contained for offline/demo evaluation without leaking into production database queries.

---

## 4. Breaking Changes & Compatibility Analysis

| Component | Potential Risk | Mitigation in Plan |
|---|---|---|
| Existing Printed QR Codes (`/#/g/slug`) | Breaking if rules block unauthenticated reads | Rules will permit unauthenticated read of published properties by slug query. Guest view updated to fetch by slug directly. Zero URL change. |
| Existing NFC Tags | Breaking if links change | No link changes. Domain and hash path remain identical. |
| Existing Host Properties without `ownerId` | Inaccessible if rules strictly demand `ownerId == auth.uid` | Migration check: on first host login, claim legacy properties matching host email or allow claiming via migration utility. |
| Requests & Feedback without `hostId` | Host unable to see legacy tickets | Add fallback mapping during Phase 2 that looks up `propertyId` to assign missing `hostId`. |
| Unauthenticated Demo Mode | Broken if rules block unauthenticated reads/writes | Demo mode will be executed purely in-memory using React state and localStorage. |

---

## 5. Migration & Testing Verification Matrix

### Pre-Deployment Verification (Before Rules Deploy)
- [ ] Export current in-memory properties and database state to a local JSON snapshot as a precautionary backup.
- [ ] Verify TypeScript compilation with `tsc --noEmit`.
- [ ] Verify Vite build with `npm run build`.

### Post-Deployment Verification (After Phase 1 & 2 Deploy)
- [ ] **Test 1 (Host Isolation)**: Sign in as Host A. Create Property "Test A". Sign in as Host B. Verify Property "Test A" is invisible in dashboard and state.
- [ ] **Test 2 (Draft Protection)**: Set Property "Test A" to draft. Attempt unauthenticated fetch of Property "Test A" slug. Verify access is denied.
- [ ] **Test 3 (Published Guest Access)**: Set Property "Test A" to published. Open in an incognito window via `/#/g/test-a`. Verify guide loads cleanly.
- [ ] **Test 4 (Cross-Tenant Requests)**: Submit a guest request from incognito on Property "Test A". Verify it appears in Host A's inbox and NOT in Host B's inbox.
- [ ] **Test 5 (Door Code Integrity)**: Confirm door codes render properly for guests at check-in time without being exposed via collection-wide listing.
- [ ] **Test 6 (Admin Route Protection)**: Navigate to `/#/admin` as an unauthenticated or non-admin user. Verify immediate redirection.

---

## 6. Execution Gate

Execution is paused. No files will be modified until you confirm your approval.

When ready, respond with **"Proceed"** or indicate any desired adjustments to Decision 1 or Decision 2.
