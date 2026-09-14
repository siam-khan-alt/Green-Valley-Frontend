# FRONTEND_MODULES.md — Green Valley Developers

Purpose: the single map of the **frontend module breakdown**. Read this file **before generating any frontend code** so every session (human or AI) builds the same structure and never leaves a domain behind.

Source-of-truth chain when building: **this file** (what modules exist) → **API.md** (exact endpoint contracts) → **UI.md** (design system rules) → `global.css` + reusable components.

## 1. Non-negotiables (don't re-read, just follow)

- Frontend is **AI-heavy**, built against **mock API/data first** (Axios + mock adapter), matched 1:1 to `API.md` contracts — swapping to the real Django backend later must be a services-layer-only change.
- All UI follows **UI.md**: semantic color tokens (light + dark), token-based radius/spacing, reuse core components — never ad hoc styling/hex colors.
- A **status** (Planning/Active/Delayed/Completed, indent/PO/RA statuses, inspection statuses…) gets ONE consistent Badge component with a semantic color map — no per-screen redesign.
- **Calculated values are displayed, not typed**: progress %, work-package % complete, BOQ totals, profitability, RA-bill amounts are derived from data and shown read-only.

## 2. Standard feature-module structure (every module uses this)

```
features/<module>/
├── pages/            # route components for this feature
├── components/       # module-specific UI (reuses core kit)
├── hooks/            # TanStack Query hooks: useXxxList, useXxx, useCreateXxx, useUpdateXxx, useDeleteXxx
├── services/         # Axios calls for THIS module only (grouped by endpoint in API.md)
├── types.ts          # TS types matching API.md payloads exactly
└── index.ts          # barrel export
```

## 3. Total breakdown

**23 modules = 4 Core + 19 Domain.**

### A. CORE (4) — foundation, build FIRST, in order

| # | Module | What it contains | Backs |
|---|--------|------------------|-------|
| 1 | **UI Kit (Design System)** | Core components from UI.md §8: Button, Input, Select, Textarea, Modal, Dropdown, Card, Table, Badge, Tabs, Toast, Pagination, Empty/Loading/Error State; token system (`--color-*`, `--radius-*`, spacing) with light/dark | Every screen |
| 2 | **Auth & Session** | Login page; JWT access/refresh handling; route guards; role-based rendering (Admin, PM, Site Staff, Finance, Viewer); "me" user context | Everything |
| 3 | **App Shell / Layout** | Sidebar navigation (module groups), header, theme toggle, breadcrumbs, loading/error boundaries, org context | Every page |
| 4 | **API Core** | Axios instance + auth interceptor + refresh-on-401; mock adapter (MSW-style or in-memory); TanStack Query client config; error→Toast mapping; base types (`Page<T>`, `IdObject`, ISO dates, `{ detail }` errors) | All features |

### B. DOMAIN (19) — build after core, dependency order (5→23)

| # | Module | Key pages / views | Key data (real fields) | API.md § |
|---|--------|-------------------|------------------------|:-------:|
| 5 | **Projects** | List (summary table + status badges), Create/Edit form, Detail (KPI cards: budget, actual_cost, forecast_final_cost, expected_profit, progress_pct) | name, type (residential/commercial/…), location, start_date, end_date, status, budget | §4 |
| 6 | **Schedule** | Milestone list + timeline, planned vs actual date comparison, delayed highlighting | name, planned_date, actual_date, status (not_started/in_progress/completed/delayed) | §5 |
| 7 | **WorkPackages** | WP list per project, detail summary (boq_scope, measured_quantity, progress_pct, labor_cost, po_cost, ra_bill_value), CRUD | code, name, description, planned_start, planned_end, contractor, status | §5 |
| 8 | **BOQ** | BOQ view with running totals, item CRUD (work_package, material, description, unit, quantity, rate, amount) | version, items[], project total → budget baseline | §6 |
| 9 | **Procurement** | Indent list + status workflow (drafted→submitted→approved→rejected→ordered), create-PO action, PO list (issued→partially_received→received→closed), GRN log (partial receipts vs PO qty) | indent: {work_package, material, required_quantity, required_date, status}; po: {supplier, quantity, unit_price, po_date, due_date, status}; grn: {received_quantity, received_date, notes} | §8 |
| 10 | **Materials** | Catalog CRUD | name, unit, default_rate | §7 |
| 11 | **Suppliers** | CRUD | name, contact_info | §7 |
| 12 | **Contractors** | CRUD + assign to work packages | name, contact_info, type (contractor/subcontractor) | §9 |
| 13 | **Labor (Muster Roll)** | Muster entry form (date, work_package, labor_type, head_count, hours_worked, rate → auto amount), daily register view | per-entry computed amount → labor cost | §9 |
| 14 | **Machinery** | Register CRUD (name, type, asset_no, daily_rate) + daily usage log (machinery, work_package, date, hours_used, operator, rate → amount) | usage cost feeds Actual Cost | §9 |
| 15 | **Operations (DPR)** | Daily Work Report form (date, work_package, weather, work_done, quantity_achieved, labor/machinery used, notes), DPR history feed, progress-over-time chart (derived) | progress is DERIVED from DPRs + measurement, never free-typed | §10 |
| 16 | **Quality** | Inspection request list + workflow (requested→scheduled→passed/rejected), prerequisite gating for measurement | work_package, type, requested_by, scheduled_date, status, remarks | §11 |
| 17 | **Billing** | Measurement Book entries (work_package, boq_item, measured_quantity, unit, measurement_date, status draft→verified→approved), RA Bills + "Generate" action (builds lines from approved measurements at BOQ rates), deductions (advance, retention, material_issue, penalty), net_payable, submit/approve | lines → gross_amount → net_payable | §13 |
| 18 | **Variations** | Change order CRUD + approve/reject workflow; shows cost_impact + schedule_impact_days, effect on forecast | description, cost_impact, schedule_impact_days, status (proposed/approved/rejected) | §12 |
| 19 | **Expenses & Payments** | Expense CRUD (category: materials/labor/contractor/overhead/other, purchase_order?), Payment CRUD (purchase_order?/ra_bill?/related_expense?), Budget-vs-Actual breakdown by category | amounts per category → feed Actual Cost | §14 |
| 20 | **Profitability + What-if Simulation ⭐** | Profitability view (budget, actual_cost, forecast_final_cost, expected_profit, budget_variance, cost_breakdown, work_packages breakdown); simulation form (material_price_change_pct, delay_days, extra_variation_cost) → baseline vs simulated vs delta, clearly marked HYPOTHETICAL | stateless, read-only by default | §15 |
| 21 | **Reports** | Portfolio report (aggregate budget vs actual, profitability comparison), project report bundle (cost breakdown, progress chart data, recent procurement/RA-bill activity) | charts + tables | §16 |
| 22 | **Users & Roles** | User list, create user, change role/status (Admin only) | email, role, is_active | §3 |
| 23 | **Audit Log** | Admin-only log view; filter by user/date/target_type; shows action + timestamp + metadata | user, action, target_type, target_id, timestamp | §17 |

### Optional merges (only if a smaller surface is wanted — NOT the default)
- **10 Materials + 11 Suppliers → `Catalog`** → total 22
- **22 Users & Roles + 23 Audit Log → `Admin`** → total 21

## 4. Module status tracker (update after every module)

Legend: ✅ done · 🔨 in progress · ⬜ pending

| # | Module | Status |
|---|--------|--------|
| 1 | **UI Kit (Design System)** | ✅ |
| 2 | **Auth & Session** | ✅ |
| 3 | **App Shell / Layout** | ✅ |
| 4 | **API Core** | ✅ |
| 5 | **Projects** | ✅ |
| 6 | **Schedule** | ✅ |
| 7 | **WorkPackages** | ✅ |
| 8 | **BOQ** | ✅ |
| 9 | **Procurement** | ✅ |
| 10 | **Materials** | ⬜ |
| 11 | **Suppliers** | ⬜ |
| 12 | **Contractors** | ⬜ |
| 13 | **Labor (Muster Roll)** | ⬜ |
| 14 | **Machinery** | ⬜ |
| 15 | **Operations (DPR)** | ⬜ |
| 16 | **Quality** | ⬜ |
| 17 | **Billing** | ⬜ |
| 18 | **Variations** | ⬜ |
| 19 | **Expenses & Payments** | ⬜ |
| 20 | **Profitability + Simulation** | ⬜ |
| 21 | **Reports** | ⬜ |
| 22 | **Users & Roles** | ⬜ |
| 23 | **Audit Log** | ⬜ |

## 5. Build order (dependency-driven)

```
1 UI Kit → 2 Auth → 3 App Shell → 4 API Core
then domain in listing order 5→23 (Projects first so every other module has a real project to attach to,
then the construction flow: Schedule/WP → BOQ → Procurement → Labor/Machinery → DPR → Inspection → Billing → Finance → Profitability)
```

## 6. Cross-cutting rules (apply to every module)

- **Permissions**: route guard + server rule per role. Site/Progress Staff can only write DPR/muster/machinery/progress data; PM manages BOQ/indents/wps/variations/measurements/inspection approvals; Finance writes expenses/payments; Viewer read-only.
- **Status map**: one shared Badge + color map — project status, WP status, milestone status, indent/PO/GRN, inspection, RA-bill statuses all use semantic colors from UI.md (success/warning/danger/info/neutral).
- **Numbers**: financial figures are formatted centrally (currency configurable — default demonstration currency configurable via a single formatter util); derived totals shown read-only with clear sourcing.
- **Empty/loading/error states**: every list/detail view must handle all three using core components — never a blank screen.
- **Dates**: ISO 8601 in services, formatted for display via a shared date util.

## 7. Definition of Done (per module)

- [ ] All API.md endpoints for the module are implemented in `services/` with correct types (mock data first).
- [ ] Pages/views built with core components + UI.md tokens (light + dark).
- [ ] List views have pagination + empty/loading/error states; tables have stable column layout.
- [ ] Permissions enforced (UI hides/disables what the role can't do).
- [ ] Status/derived numbers rendered correctly and consistently.
- [ ] Barrel exports + no circular imports; module builds with no TypeScript errors.
- [ ] Mock → real swap later is a services-layer-only change.
- [ ] Git Commit Workflow executed (commit + push) per section 8 below.

## 8. Git Commit Workflow (MANDATORY — never skip)

Every time a module/task is fully finished and working, **immediately commit + push**. Do NOT ask for permission — just execute and inform the developer.

### Commit format
```
[TAG]: concise description starting with an imperative verb
```

### Allowed tags
| Tag | Use it when |
|-----|-------------|
| `[FEATURE]` | adding a new feature or component |
| `[UPDATED]` | modifying/enhancing existing code, UI, or logic |
| `[FIXED]`   | fixing bugs or errors |
| `[SETUP]`   | installing packages, setup, or config changes |
| `[DOCS]`    | updating documentation/README |

### Commands (in `green-valley-frontend/`, the frontend git repo)
```bash
git add .
git commit -m "[TAG]: Description of work"
git push
```

### Rules
- One commit per finished module; commit type matches the dominant change.
- Example: `[FEATURE]: Add Projects list page with KPI summary table`
- Remote: `origin` → `Green-Valley-Frontend` GitHub repo.
- If the previous push failed (e.g. token/auth), diagnose, fix, and retry — do not silently skip.