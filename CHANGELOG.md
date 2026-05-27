# Changelog — 7 May 2026

## Transfer Plan — Leg 2 starts from correct stop

**Files:** `src/pages/Map/RouteListPage.tsx`

- `TransferCard` now accepts `onSelectLeg1` and `onSelectLeg2` as separate handlers instead of a single `onSelect`
- Tapping leg 1 passes `plan.transferStopName` as the destination (`toQuery`) so the stop list is trimmed at the transfer point
- Tapping leg 2 calls `setFromQuery(plan.walkToStopName ?? plan.transferStopName)` before navigating so `RouteDetailPage` trims from the correct board stop

---

## Search Fields Reset on Map Navigation

**Files:** `src/components/layout/BottomNav/BottomNav.tsx`, `src/pages/Map/MapSearchPage.tsx`

- BottomNav "Карта" tap now calls `setQuery`, `setFromQuery`, `setResults`, `setTransferPlans` to empty values before navigating
- `MapSearchPage` also clears those four fields in a `useEffect` on mount — covers back-button and direct navigation cases

---

## Route List — Search Context Label

**Files:** `src/pages/Map/RouteListPage.tsx`, `src/pages/Map/RouteListPage.module.css`

- A `searchContext` label is displayed above the route list only when results are found
- Three display cases:
  - **Stop tap on map** → stop name only (e.g. `Площа Ринок`)
  - **My location → stop** → `Моє місцезнаходження — Залізничний вокзал`
  - **Stop → stop** → `Площа Ринок — Залізничний вокзал`
- TopBar title simplified to plain `'Маршрути'` (removed dynamic query string)
- Added `.searchContext` CSS rule

---

## Stop List Trimmed After Destination

**Files:** `src/pages/Map/RouteDetailPage.tsx`, `src/pages/Map/RouteListPage.tsx`

- `RouteDetailPage` now reads `toQuery` from React Router navigation state (`location.state`)
- After slicing from the departure stop, it further slices off stops that follow the destination stop
- Navigation from `RouteListPage` passes `toQuery` in state:
  - Direct route → `toQuery = query` (the destination field)
  - Transfer leg 1 → `toQuery = plan.transferStopName`
  - Transfer leg 2 → `toQuery = query`
- Stop tap from map (no destination) → no `toQuery` passed, full list from board stop shown

---

## Purchase History — Correct Ticket Status Badges

**Files:** `src/pages/Tickets/PurchaseHistoryPage.tsx`, `src/pages/Tickets/PurchaseHistoryPage.module.css`

Previous behaviour: any ticket with `is_used = false` showed "Дійсний" even after expiry.

New badge logic:

| Condition | Label | Colour |
|---|---|---|
| `valid_until` in the past | **Використаний** | Grey |
| `valid_until` in the future AND `is_used = true` | **Активний** | Blue |
| `valid_until` in the future AND `is_used = false` | **Дійсний** | Green |

Added `.active` CSS class (blue).  
Removed `.expired` CSS class (no longer needed).

---

## Buying Blocked While a Valid Ticket Exists

**Files:** `src/lib/supabase/tickets.ts`, `src/pages/Tickets/MyTicketsPage.tsx`, `src/pages/Tickets/MyTicketsPage.module.css`

- Added `fetchAnyValidTicket(userId)` — queries tickets where `valid_until > now` (regardless of `is_used`)
- `MyTicketsPage` fetches this on mount and stores result in local state
- "Купити квитки" button is `disabled` and styled with `.disabled` (50% opacity, `not-allowed` cursor) when a valid ticket exists
- A small hint text "є дійсний квиток" appears inside the button when blocked
- Added `.disabled` and `.tileHint` CSS rules
