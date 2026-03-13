# TrekStories – Full Feature Development Plan

> Generated after deep analysis of: booking schema, payment schema, tour schema, transaction schema, setting schema, bookings.service.ts, payments.service.ts, notifications.service.ts (with WhatsApp queue stub), settings.service.ts, home.service.ts, PickupType/BookingStatus/PaymentStatus enums, frontend admin sidebar, UI components, and frontend routing.

---

## Codebase Analysis Summary

| Area                     | Current State                                                                                                                                                                                                                                             |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **BookingStatus**        | `PENDING`, `CONFIRMED`, `CANCELLED`, `COMPLETED`, `ON_HOLD`                                                                                                                                                                                               |
| **PaymentType**          | `ONLINE`, `OFFLINE`, `PARTIAL` (enum exists, not wired to 50/100%)                                                                                                                                                                                        |
| **PickupType**           | `AC`, `NON_AC`, `FLIGHT`, `TRAIN` (needs 5 new values)                                                                                                                                                                                                    |
| **Booking schema**       | Has `paidAmount`, `pendingAmount`, `paymentType` — partial payment foundation exists                                                                                                                                                                      |
| **Payment flow**         | Online: user uploads receipt → admin approves → CONFIRMED / Offline: admin records → auto-confirms if full                                                                                                                                                |
| **WhatsApp**             | Queue (`whatsapp`) + processor exist; processor is a **mock** (no real API wired)                                                                                                                                                                         |
| **Settings**             | Stores `businessDetails`, `socialMedia`, `paymentDetails`, `otherSettings` — save is working                                                                                                                                                              |
| **Home service**         | Returns `settings` inside [getHomeData()](file:///d:/tours-and-travels-app/travel-backend/src/modules/home/home.service.ts#30-92) — foundation for dynamic hero content                                                                                   |
| **Policies**             | Frontend has `/privacy-policy` and `/terms-and-conditions` routes; no policy pages route yet for booking instructions/refund                                                                                                                              |
| **Image upload**         | ImgBB only; no Cloudinary; no fallback image handling                                                                                                                                                                                                     |
| **Loader**               | [Skeleton.tsx](file:///d:/tours-and-travels-app/travel-frontend/src/components/ui/Skeleton.tsx) and [Spinner.tsx](file:///d:/tours-and-travels-app/travel-frontend/src/components/ui/Spinner.tsx) exist; main page loader is airplane (needs tracker-man) |
| **Admin sidebar**        | Uses Lucide icons; 13 nav items; no IP restriction; no policies link                                                                                                                                                                                      |
| **Refund**               | `TransactionType.REFUND` enum exists; no refund service/flow implemented                                                                                                                                                                                  |
| **User profile (admin)** | Issue: user details page not showing all fields                                                                                                                                                                                                           |

---

## Task 1 – Partial Payment Option (50% / 100%)

### 1.1 Backend

**File: [travel-backend/src/common/enums/booking-status.enum.ts](file:///d:/tours-and-travels-app/travel-backend/src/common/enums/booking-status.enum.ts)**

- [ ] Add new `PaymentType.PARTIAL` is already present — verify it is used correctly in the 50% flow

**File: [travel-backend/src/modules/bookings/dto/create-booking.dto.ts](file:///d:/tours-and-travels-app/travel-backend/src/modules/bookings/dto/create-booking.dto.ts)**

- [ ] Add `paymentType: 'FULL' | 'PARTIAL'` field (optional, defaults to `FULL`)

**File: [travel-backend/src/modules/bookings/bookings.service.ts](file:///d:/tours-and-travels-app/travel-backend/src/modules/bookings/bookings.service.ts)**

- [ ] In [createBooking()](file:///d:/tours-and-travels-app/travel-backend/src/modules/bookings/bookings.service.ts#139-227): if `paymentType === 'PARTIAL'`, set `paidAmount = 0`, `pendingAmount = totalAmount`, `paymentType = PaymentType.PARTIAL` and `status = BookingStatus.PENDING`
- [ ] If `paymentType === 'FULL'`, set `paidAmount = 0`, `pendingAmount = totalAmount`, `paymentType = PaymentType.ONLINE`, `status = BookingStatus.PENDING`
- [ ] **50% booking status decision**: Status stays `PENDING` until payment receipt is uploaded & approved. When partial amount (≥50%) is approved by admin → status = `ON_HOLD`. When remaining is paid and approved → status = `CONFIRMED`.
- [ ] Add [previewBooking()](file:///d:/tours-and-travels-app/travel-backend/src/modules/bookings/bookings.service.ts#30-124) response: include `halfAmount` (50% of totalAmount) in response

**File: [travel-backend/src/modules/payments/payments.service.ts](file:///d:/tours-and-travels-app/travel-backend/src/modules/payments/payments.service.ts)**

- [ ] In [approvePayment()](file:///d:/tours-and-travels-app/travel-backend/src/modules/payments/payments.service.ts#105-172): after updating `paidAmount`, check if `booking.paidAmount >= booking.totalAmount`. If so, confirm booking. Else if `paidAmount >= 50%` → set status = `ON_HOLD` (partial paid, remaining due).
- [ ] Add `getMyBookingPaymentHistory(bookingId, userId)` API for user dashboard to see what is paid vs pending

**File: [travel-backend/src/modules/bookings/bookings.controller.ts](file:///d:/tours-and-travels-app/travel-backend/src/modules/bookings/bookings.controller.ts)**

- [ ] Expose `GET /bookings/:id/payment-summary` endpoint returning `totalAmount`, `paidAmount`, `pendingAmount`, `paymentType`

### 1.2 Frontend

**File: [travel-frontend/app/(main)/booking/preview/page.tsx](file:///d:/tours-and-travels-app/travel-frontend/app/%28main%29/booking/preview/page.tsx)** (or booking modal)

- [ ] Add payment option radio buttons: **Pay 50% Now (Advance)** and **Pay 100% (Full Payment)**
- [ ] Show 50% amount and full amount dynamically
- [ ] Pass selected `paymentType` in booking creation API call

**File: `travel-frontend/app/dashboard/` (User Dashboard)**

- [ ] In booking detail page: show "Remaining Amount Due: ₹X" if `pendingAmount > 0`
- [ ] Add "Pay Remaining" button → redirects to payment upload with `amount = pendingAmount`

### 1.3 Risk Points

- Guard against user paying more than `pendingAmount`
- Coupon discount applies to `totalAmount`; 50% is calculated after discount
- If partial payment is rejected by admin, booking goes back to `ON_HOLD`; handle re-upload

---

## Task 2 – Booking Confirmation Policy (T&C / Privacy / Instructions)

### 2.1 Backend

- No backend changes required — policy acceptance is a frontend-only UX gate

### 2.2 Frontend

**File: `travel-frontend/app/(main)/booking/preview/page.tsx`** (booking step)

- [ ] Add 3 checkboxes before "Confirm Booking" button:
  - `☐ I accept Terms & Conditions` (links to `/terms-and-conditions`)
  - `☐ I accept Privacy Policy` (links to `/privacy-policy`)
  - `☐ I have read the Booking Instructions` (links to `/booking-instructions`)
- [ ] Disable booking submit button unless all 3 are checked
- [ ] Show inline validation error if user tries to submit without checking

### 2.3 Risk Points

- Checkbox state must reset if user changes tour/travelers
- Store acceptance state in local component state only (not persisted)

---

## Task 3 – Booking Modal UI Fix (Top Position, Independent Scroll)

### 3.1 Frontend

**File: `travel-frontend/src/components/ui/Modal.tsx`**

- [ ] Fix modal to always open at top: `align-items: flex-start` instead of `center` on modal backdrop
- [ ] Add `overflow-y: auto` and `max-height: 90vh` to modal content wrapper
- [ ] Add `scroll-behavior: smooth` and on open, call `modalRef.current.scrollTop = 0`
- [ ] Backdrop should be `position: fixed, inset: 0, overflow-y: auto`, modal container `margin: 24px auto`

### 3.2 Risk Points

- Check all places Modal is used to not break existing modals
- Mobile: modal should be full-screen on small viewports

---

## Task 4 – UI Improvements

### 4.1 Main Loader Update (Airplane → Tracker Man)

**File: `travel-frontend/app/globals.css`** or loader component

- [ ] Find current airplane SVG/Lottie loader in main page loading state
- [ ] Replace with tracker/hiker man animation (use Lottie JSON or CSS animation)
- [ ] Apply globally: page transitions, API loading states

### 4.2 Skeleton/Spinner Loaders (Consistent Pattern)

**Existing:** `Skeleton.tsx`, `Spinner.tsx` already exist in `src/components/ui/`

- [ ] **Admin pages**: wrap all `fetch`-dependent sections with `<Skeleton>` loader (tours list, users list, bookings list, payments list)
- [ ] **Booking submit button**: add `ButtonLoadingState` variant in `Button.tsx` — spinner + "Submitting..." text while API call is in progress
- [ ] **Payment verification**: show spinner on admin approve/reject buttons while processing
- [ ] **Tour listing page**: add skeleton cards while tours load
- [ ] **Blog listing page**: add skeleton cards

### 4.3 Image Handling – Cloudinary Migration

**Backend: `travel-backend/src/common/services/`**

- [ ] Create `image-upload.service.ts` supporting both ImgBB and Cloudinary based on `.env` variable `IMAGE_PROVIDER=cloudinary|imgbb`
- [ ] Default to Cloudinary
- [ ] Add `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` to `.env`
- [ ] Add these same vars to `travel-backend/.env` and `travel-frontend/.env.local`
- [ ] Cloudinary upload: use `cloudinary.v2.uploader.upload()` with `folder: 'trekstories'`
- [ ] All existing image upload endpoints (tours, blogs, team, user avatar, UPI QR) must use `ImageUploadService` instead of direct ImgBB

**Frontend: Image handling**

- [ ] Add `fallbackSrc` prop to Next.js `<Image>` components across:
  - Tour thumbnail images
  - Blog images
  - User avatar
  - Banner images
  - Team member photos
- [ ] Add `loading="lazy"` to all non-critical images
- [ ] Create `<SafeImage>` component in `src/components/shared/SafeImage.tsx` with built-in fallback and lazy loading
- [ ] Use `<SafeImage>` everywhere instead of raw `<img>` or `<Image>` without fallback

### 4.4 Icon System (Optional Improvement)

**Current:** Lucide Icons already used in `AdminSidebar.tsx` — this is correct.

- [ ] Audit frontend components for any inconsistent icon usage (e.g., Font Awesome, emoji, custom SVG)
- [ ] Replace all non-Lucide icons with Lucide equivalents:
  - Booking → `BookOpen`
  - Payment → `CreditCard`
  - Tour details → `MapPin`
  - User → `UserCircle`
- [ ] Update user-facing booking pages to use Lucide instead of template icons

---

## Task 5 – Admin Panel Improvements

### 5.1 Admin Sidebar Update

**File: `travel-frontend/src/components/admin/AdminSidebar.tsx`**

- [ ] Add **Policies** link: `{ name: 'Policies', path: '/admin/policies', icon: FileText }` — after Settings
- [ ] Add **Refunds** link: `{ name: 'Refund Manager', path: '/admin/refunds', icon: RefreshCcw }`
- [ ] Add section dividers (group related items):
  - **Content**: Tours, Blogs, Team, Reviews
  - **Bookings & Finance**: Booking Manager, Payments, Transactions, Refunds, Coupons
  - **Users**: User Management
  - **System**: Broadcasts, System Logs, Settings, Policies
- [ ] Improve active state styling with left border highlight

### 5.2 Admin Settings Fix

**Current issue:** Settings save via `PATCH /admin/settings` but the frontend settings form may not be sending the correct nested structure.

**File: `travel-backend/src/modules/settings/settings.service.ts`**

- [ ] Verify `updateSettings()` upsert uses proper `$set` with nested paths (currently does `{ $set: updateDto }` — this works if DTO is properly shaped)
- [ ] Add validation DTO for settings with proper nested types

**File: `travel-frontend/app/admin/settings/page.tsx`**

- [ ] Check that form submission sends nested structure: `{ businessDetails: {...}, socialMedia: {...}, paymentDetails: {...}, otherSettings: {...} }`
- [ ] Add loading state on save button
- [ ] Add success/error toast after save
- [ ] Add WhatsApp number field in settings (for notifications)
- [ ] Add `adminIpWhitelist` field in settings (array of allowed IPs)

**File: `travel-backend/src/database/schemas/setting.schema.ts`**

- [ ] Add to `OtherSettings`: `whatsappNumberForNotifications?: string`
- [ ] Add to `Setting`: `adminIpWhitelist?: string[]` for IP restriction

### 5.3 User Profile – Admin View Fix

**File: `travel-backend/src/modules/users/`**

- [ ] Find/update `adminGetUserById()` to populate: `name`, `email`, `phone`, `createdAt` (joined date), `role`, `avatar`
- [ ] Add aggregation to count total bookings by user and total amount spent
- [ ] Return: `{ user, totalBookings, totalSpent, bookings[] }`

**File: `travel-frontend/app/admin/users/[id]/page.tsx`**

- [ ] Fix data display: render `name`, `email`, `phone`, `joinedDate`, `totalBookings`, `totalSpent`
- [ ] Show booking history table in user detail page
- [ ] Handle null/undefined fields gracefully with fallback placeholders

---

## Task 6 – Transport Mode Update (PickupType Enum)

### 6.1 Backend

**File: `travel-backend/src/common/enums/pickup-type.enum.ts`**

- [ ] Replace current enum values with:

```typescript
export enum PickupType {
  THREE_TIER_AC_TRAIN = '3TIER_AC_TRAIN',
  BOTH_SIDE_FLIGHT = 'BOTH_SIDE_FLIGHT',
  ONE_SIDE_FLIGHT = 'ONE_SIDE_FLIGHT',
  LAND_PACKAGE = 'LAND_PACKAGE',
  TRAIN = 'TRAIN',
}
```

> Keep `FLIGHT` and `TRAIN` for backward compatibility with existing data

**All schemas using `PickupType`:**

- `tour.schema.ts` — `PickupPoint.type` uses `Object.values(PickupType)` → auto-updates
- `booking.schema.ts` — `pickupOption` embedded from tour → auto-updates

**File: `travel-backend/src/modules/tours/dto/`** (tour creation DTO)

- [ ] Ensure `IsEnum(PickupType)` validator on `departureOptions[].type` handles new values

### 6.2 Frontend

**File: `travel-frontend/src/lib/constants/enums.ts`** (or equivalent)

- [ ] Mirror `PickupType` enum with same values + add display labels:

```typescript
export const PICKUP_TYPE_LABELS: Record<string, string> = {
  NON_AC_TRAIN: 'Non-AC Train',
  THREE_TIER_AC_TRAIN: '3-Tier AC Train',
  BOTH_SIDE_FLIGHT: 'Both Side Flight',
  ONE_SIDE_FLIGHT: 'One Side Flight',
  LAND_PACKAGE: 'Land Package (Self Travel)',
};
```

**File: Admin Tour Form** (`travel-frontend/app/admin/tours/`)

- [ ] Update departure options type dropdown to show all new PickupType values with human-readable labels

**File: Tour detail page / Booking preview page**

- [ ] Display `PICKUP_TYPE_LABELS[type]` instead of raw enum value

---

## Task 7 – Home Page Dynamic Content (Admin Controlled)

### 7.1 Backend

**File: `travel-backend/src/database/schemas/setting.schema.ts`**

- [ ] Add new `HeroContent` sub-schema:

```typescript
class HeroContent {
  heroTitle?: string;
  heroSubtitle?: string;
  heroCta?: string;
  heroCtaUrl?: string;
  heroBannerImage?: string;
  heroHighlights?: string[]; // e.g. ["5000+ Happy Travelers", "200+ Tours"]
}
```

- [ ] Add `@Prop({ type: HeroContent, default: () => ({}) }) heroContent: HeroContent` to `Setting`

**File: `travel-backend/src/modules/home/home.service.ts`**

- [ ] `getHomeData()` already returns `settings` — the hero content will be included automatically

### 7.2 Admin Frontend

**File: `travel-frontend/app/admin/settings/page.tsx`**

- [ ] Add "Home Page Hero" section with fields:
  - Hero Title (text input)
  - Hero Subtitle (textarea)
  - CTA Button Text + URL
  - Hero Banner Image (upload)
  - Highlight badges (array: "5000+ Travelers", "200+ Tours" etc.)

### 7.3 User Frontend

**File: `travel-frontend/src/components/home/`** (Hero section component)

- [ ] Fetch `settings.heroContent` from home API response
- [ ] Render dynamically: title, subtitle, CTA button, banner image, highlights
- [ ] Fallback to static defaults if `heroContent` fields are empty

---

## Task 8 – Departure Logic Update

### 8.1 Backend

**File: `travel-backend/src/database/schemas/tour.schema.ts`**

- [ ] `PickupPoint.toCity` is already `@Prop()` (no `required`) — it's already optional ✅
- [ ] Ensure `totalDays` and `totalNights` are present on `PickupPoint` (they already exist ✅)

**File: `travel-backend/src/modules/bookings/bookings.service.ts`**

- [ ] In `previewBooking()`: validate that `toCity` can be absent without error

### 8.2 Frontend

**File: Admin Tour Form** (departure options section)

- [ ] Mark "Departure To" field as Optional with placeholder "(Optional)"
- [ ] Show `totalDays / totalNights` per departure option (e.g., "3 Days / 2 Nights")
- [ ] Calculate `totalNights = totalDays - 1` as default if not manually set

**File: Tour detail page / Booking preview**

- [ ] Display: "Departure From → To (Optional)"
- [ ] Show duration badge: "3 Days / 2 Nights" beneath departure option

---

## Task 9 – Refund System

### 9.1 Backend

**File: `travel-backend/src/common/enums/transaction.enum.ts`**

- [ ] `TransactionType.REFUND` already exists ✅

**File: `travel-backend/src/database/schemas/booking.schema.ts`**

- [ ] Add fields:
  - `refundStatus: string` (enum: `NONE`, `REQUESTED`, `APPROVED`, `REJECTED`, `PROCESSED`)
  - `refundAmount: number` (default 0)
  - `refundReason: string`
  - `refundRequestedAt: Date`
  - `refundProcessedAt: Date`

**New File: `travel-backend/src/modules/refunds/refunds.service.ts`**

- [ ] `requestRefund(userId, bookingId, reason)`:
  - Only if booking is `CANCELLED` and `paidAmount > 0`
  - Set `refundStatus = REQUESTED`, `refundReason`, `refundRequestedAt`
  - Notify admin
- [ ] `adminApproveRefund(adminId, bookingId, refundAmount)`:
  - Validate `refundAmount <= booking.paidAmount`
  - Set `refundStatus = APPROVED`, `refundAmount`, create `Transaction(REFUND)`
  - Notify user
- [ ] `adminRejectRefund(adminId, bookingId, reason)`:
  - Set `refundStatus = REJECTED`
  - Notify user
- [ ] `markRefundProcessed(adminId, bookingId)`:
  - Set `refundStatus = PROCESSED`, `refundProcessedAt`
- [ ] `getRefundRequests(filters)`: admin list with pagination

**New File: `travel-backend/src/modules/refunds/refunds.controller.ts`**

- [ ] `POST /refunds/request` (user)
- [ ] `GET /admin/refunds` (admin)
- [ ] `POST /admin/refunds/:id/approve` (admin)
- [ ] `POST /admin/refunds/:id/reject` (admin)
- [ ] `POST /admin/refunds/:id/processed` (admin)

**File: `travel-backend/src/modules/bookings/bookings.service.ts`**

- [ ] Modify `cancelBooking()`: if `paidAmount > 0`, auto-set `refundStatus = REQUESTED`

### 9.2 Frontend – User

**File: `travel-frontend/app/dashboard/bookings/[id]/page.tsx`**

- [ ] Show "Request Refund" button only if:
  - Booking is `CANCELLED`
  - `paidAmount > 0`
  - `refundStatus === 'NONE'`
- [ ] Refund request flow: modal asking for reason → submit

**File: `travel-frontend/app/dashboard/bookings/`**

- [ ] Show refund status badge in booking list

### 9.3 Frontend – Admin

**File: `travel-frontend/app/admin/refunds/page.tsx`** _(new page)_

- [ ] Table: booking number, user, paidAmount, refundAmount requested, status, actions
- [ ] Approve (with amount input), Reject (with reason), Mark Processed

### 9.4 Price Breakdown – Fix "Pickup" → "Extra"

- [ ] In `bookings.service.ts` `pricingSummary` generation: replace `"Pickup"` with `"Extra"`
- [ ] Remove vehicle type from price summary display (only show adjustment amount)

---

## Task 10 – WhatsApp Notification Integration

### 10.1 Setup Requirements (Meta WhatsApp Business API)

**Step-by-step setup guide for admin:**

1. Create Meta Business Account at [business.facebook.com](https://business.facebook.com)
2. Create WhatsApp Business App in [developers.facebook.com](https://developers.facebook.com)
3. Add WhatsApp product to the App
4. Get **Phone Number ID** and **Permanent Access Token**
5. Register a phone number (you can start with Meta test number)
6. Create **Message Templates** (must be pre-approved by Meta):
   - Template name: `booking_confirmed` (Language: English)
   - Template name: `booking_cancelled`
   - Template name: `payment_received`
   - Template name: `refund_processed`
7. Submit templates for Meta review (1-24 hours approval)

**Required `.env` variables (backend):**

```env
WHATSAPP_PROVIDER=meta         # or 'twilio'
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
WHATSAPP_ACCESS_TOKEN=your_permanent_token
WHATSAPP_API_VERSION=v22.0
```

### 10.2 Backend

**File: `travel-backend/src/modules/notifications/processors/whatsapp.processor.ts`**

- [ ] Replace mock logger with real Meta Cloud API call:

```typescript
const url = `https://graph.facebook.com/${process.env.WHATSAPP_API_VERSION}/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;
await axios.post(url, {
  messaging_product: 'whatsapp',
  to: phone,   // must be in international format e.g. 919876543210
  type: 'template',
  template: {
    name: templateName,
    language: { code: 'en' },
    components: [{ type: 'body', parameters: [...] }]
  }
}, { headers: { Authorization: `Bearer ${token}` } });
```

**File: `travel-backend/src/modules/notifications/notifications.service.ts`**

- [ ] Update `sendWhatsApp()` to accept `templateName` and `templateParams` array
- [ ] Call `sendWhatsApp()` in:
  - `bookings.service.ts`: `adminConfirmBooking()` → send `booking_confirmed` template
  - `bookings.service.ts`: `cancelBooking()` → send `booking_cancelled` template
  - `payments.service.ts`: `approvePayment()` → send `payment_received` template
  - `refunds.service.ts`: `markRefundProcessed()` → send `refund_processed` template

**File: `travel-backend/src/database/schemas/setting.schema.ts`**

- [ ] Add to `OtherSettings`:
  - `whatsappEnabled?: boolean`
  - `whatsappPhoneNumberId?: string`
  - `whatsappAccessToken?: string` (encrypted storage recommended)

### 10.3 Meta Message Templates (to submit for approval)

**`booking_confirmed` template body:**

```
Hello {{1}},

✅ Your booking is *CONFIRMED*!

📋 Booking ID: {{2}}
🗺️ Tour: {{3}}
📅 Date: {{4}}
👥 Travelers: {{5}}
💰 Amount: ₹{{6}}

Thank you for choosing TrekStories!
Need help? Contact us at support@trekstories.in
```

**`booking_cancelled` template body:**

```
Hello {{1}},

❌ Your booking #{{2}} for *{{3}}* has been cancelled.

If you paid online and have questions about your refund, please visit your dashboard or contact us.

— TrekStories Team
```

**`payment_received` template body:**

```
Hello {{1}},

💳 Payment Received!

Booking ID: {{2}}
Amount Paid: ₹{{3}}
Status: Confirmed ✅

Thank you for your payment. See you on the tour!
— TrekStories
```

---

## Task 11 – Policy Pages

### 11.1 Backend

**File: `travel-backend/src/database/schemas/setting.schema.ts`**

- [ ] Add `PolicyContent` sub-schema:

```typescript
class PolicyContent {
  privacyPolicy?: string; // HTML/Markdown content
  termsAndConditions?: string;
  refundPolicy?: string;
  cancellationPolicy?: string;
  bookingInstructions?: string;
}
```

- [ ] Add `policies: PolicyContent` to `Setting`

**File: `travel-backend/src/modules/settings/settings.controller.ts`**

- [ ] Add `GET /settings/policies` (public — no auth) → returns policy content

**File: `travel-backend/src/modules/settings/settings.module.ts`**

- [ ] Expose policies endpoint publicly (no guard)

### 11.2 Frontend – Policy Pages

**Files to create/update:**

- [ ] `travel-frontend/app/(main)/privacy-policy/page.tsx` — fetch from API, render HTML
- [ ] `travel-frontend/app/(main)/terms-and-conditions/page.tsx` — fetch from API
- [ ] `travel-frontend/app/(main)/refund-policy/page.tsx` — new page
- [ ] `travel-frontend/app/(main)/cancellation-policy/page.tsx` — new page
- [ ] `travel-frontend/app/(main)/booking-instructions/page.tsx` — new page

**Footer component:**

- [ ] Add links to all 5 policy pages in the footer

**Booking page:**

- [ ] Links in T&C checkboxes (Task 2) point to actual policy pages

### 11.3 Admin – Policy Editor

**File: `travel-frontend/app/admin/policies/page.tsx`** _(new page)_

- [ ] Tab-based editor: Privacy Policy | Terms & Conditions | Refund Policy | Cancellation Policy | Booking Instructions
- [ ] Rich text editor (use `react-quill` or `@uiw/react-md-editor`)
- [ ] Save via `PATCH /admin/settings`

---

## Task 12 – IP Restriction on Admin Panel

### 12.1 Backend

**File: `travel-backend/src/common/middleware/`**

- [ ] Create `admin-ip.middleware.ts`:
  - On every `/admin` route, read `req.ip` or `X-Forwarded-For`
  - If `settings.adminIpWhitelist` is set and non-empty, block requests not in whitelist
  - Return `403 Forbidden` if IP not allowed
  - If whitelist is empty, allow all (default behavior)

**File: `travel-backend/src/app.module.ts`**

- [ ] Apply `AdminIpMiddleware` to all routes starting with `/admin/**`

**File: `travel-backend/src/database/schemas/setting.schema.ts`**

- [ ] Add `adminIpWhitelist?: string[]` to `Setting` (already mentioned in Task 5.2)

### 12.2 Admin Frontend

**File: `travel-frontend/app/admin/settings/page.tsx`**

- [ ] Add "IP Restriction" section: textarea for comma-separated IPs or CIDR ranges
- [ ] Warning: "Adding your IP incorrectly will lock you out of admin. Current IP: [detected IP]"
- [ ] Show current request IP via `GET /auth/me` or a dedicated endpoint

---

## Implementation Order (Recommended)

| Priority | Task                                       | Reason                                                        |
| -------- | ------------------------------------------ | ------------------------------------------------------------- |
| 1        | Task 6 – Transport Enum Update             | No backward compat risk, small change, unblocks tour creation |
| 2        | Task 3 – Booking Modal UI Fix              | Pure frontend, no dependencies                                |
| 3        | Task 8 – Departure Logic                   | Small change, UI improvement                                  |
| 4        | Task 9 (Price fix only) – "Pickup"→"Extra" | 1-line fix in service                                         |
| 5        | Task 1 – Partial Payment                   | Core feature, well-defined flow                               |
| 6        | Task 2 – Booking Policy Checkboxes         | Depends on policy pages existing                              |
| 7        | Task 11 – Policy Pages                     | Required for Task 2                                           |
| 8        | Task 7 – Home Dynamic Content              | Schema + settings extension                                   |
| 9        | Task 5 – Admin Panel Improvements          | Settings fix, user profile fix, sidebar update                |
| 10       | Task 4 – Loaders, Images, Icons            | Broad UI sweep                                                |
| 11       | Task 9 – Refund System                     | Complex, multi-service                                        |
| 12       | Task 12 – IP Restriction                   | Security feature                                              |
| 13       | Task 10 – WhatsApp Notifications           | Requires Meta account setup                                   |

---

## Testing Checklist

### Backend Unit Tests

- [ ] `bookings.service.spec.ts`: add test for `createBooking()` with `paymentType = PARTIAL`
- [ ] `payments.service.spec.ts`: add test for `approvePayment()` with partial paid scenario
- [ ] `bookings.service.spec.ts`: test refund request flow

### Manual Testing (API)

- [ ] `POST /bookings` with `{ paymentType: 'PARTIAL' }` → verify `paidAmount=0`, `pendingAmount=totalAmount`, `status=PENDING`
- [ ] Admin approve 50% payment → verify `status = ON_HOLD`
- [ ] Admin approve remaining payment → verify `status = CONFIRMED`
- [ ] `GET /settings/policies` → returns policy HTML content
- [ ] Admin `PATCH /admin/settings` with `policies` → verify saved to DB
- [ ] WhatsApp: send test message via `sendWhatsApp()` → verify Meta API call in prod

### Frontend Manual Testing

- [ ] Booking flow: check 3 checkboxes uncheck → submit button disabled ✅
- [ ] Booking modal: open → verify scroll starts from top ✅
- [ ] Tour page: missing image → fallback placeholder shown ✅
- [ ] Admin user detail: verify name/email/phone/bookings/spent all shown ✅
- [ ] Admin settings save → reload page → verify settings persisted ✅
- [ ] Policy pages: `/refund-policy`, `/cancellation-policy`, `/booking-instructions` load ✅
- [ ] Admin policies editor: save content → verify public page shows updated content ✅

---

## Risk Points & Edge Cases

| Risk                                                | Mitigation                                                                               |
| --------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| PickupType enum change breaks existing DB records   | Keep old values (`FLIGHT`, `TRAIN`, `AC`, `NON_AC`) in enum; add new values alongside    |
| Partial payment: user pays exactly 50% then cancels | Refund system handles `paidAmount > 0` on cancel; show refund status                     |
| WhatsApp: phone number not in E.164 format          | Sanitize phone on `sendWhatsApp()`: strip spaces, add country code +91                   |
| Admin IP whitelist locks admin out                  | Always include "show current IP" warning + allow empty whitelist = no restriction        |
| Settings upsert not working for nested fields       | Use `$set: { 'heroContent.heroTitle': value }` dot notation if full object replace fails |
| Policy editor XSS risk                              | Sanitize HTML on server before saving with `DOMPurify` or `sanitize-html`                |
| Cloudinary env not set                              | `ImageUploadService` falls back to ImgBB if `CLOUDINARY_API_KEY` is missing              |
| Refund amount > paidAmount                          | Backend validation: `refundAmount <= booking.paidAmount`                                 |
| WhatsApp template not approved                      | Log error gracefully; don't block booking confirmation if WhatsApp fails                 |
| Modal scroll position on mobile                     | Use `window.scrollTo(0, 0)` inside modal open handler on mobile                          |
