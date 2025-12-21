# EliteSport — API Data Coverage & Sorting Tasks (Local First)

Goal:
Ensure the external API fully supports all required data fields
(names, images, overview, benefits, type/category) and that
places are correctly grouped and sorted in the UI
(Hotels, Gyms, Female-only, etc.).

Rules:
- Do NOT change UI, layout, styling, or routing
- Do NOT expose API keys
- Do NOT add new libraries
- All work must run locally first
- Each task must pass `npm run build` locally

---

## TASK 1 — API Capability Audit (Agent 1) ✅ COMPLETE

Objective:
Verify whether the API provides all data required by the website
before any UI logic is changed.

Actions:
- Call the Hotels/Places API locally (server-side)
- Inspect the full API response
- Verify availability of:
  - name
  - image(s)
  - overview / description
  - benefits / features
  - type or category (hotel, gym, female-only, etc.)
- Identify missing or inconsistent fields
- Document actual API field names and values
- Do NOT modify UI or logic

Checklist:
- [x] API response inspected (57 hotels returned)
- [x] overview field: ❌ MISSING (not in API)
- [x] benefits field: ❌ MISSING (not in API)
- [x] type/category field: ❌ MISSING (not in API)
- [x] Possible values for type: N/A (field not present)
- [x] Findings documented in docs/API_AUDIT_TASK1.md

Exit Criteria:
- ✅ Clear understanding of what the API can and cannot provide
- ✅ Decision-ready input for mapping and sorting logic

### AUDIT RESULTS SUMMARY:

**API Provides (100% coverage):**
- `id` (number)
- `name` (string) 
- `phone` (string)
- `address` (string) → mapped to `location`
- `image` (string, relative path) → needs base URL

**API Does NOT Provide:**
- `overview` / `description` → UI must handle null
- `benefits` / `amenities` → UI must handle null
- `type` / `category` → All records are hotels (hardcoded)

**See full report:** `docs/API_AUDIT_TASK1.md`

---

## TASK 2 — Data Normalization & Mapping Plan (Agent 2)

Objective:
Design a clean mapping layer between API data and UI expectations
without changing components.

Actions:
- Compare API response fields with existing UI data model
- Define a normalization function:
  - API → internal Place model
- Decide how:
  - overview maps to UI
  - benefits array maps to UI
  - type/category maps to sections
- Define safe fallbacks for missing fields

Checklist:
- [ ] Mapping rules defined
- [ ] Place data model finalized
- [ ] Fallbacks documented
- [ ] No code changes yet

Exit Criteria:
- Clear, agreed mapping logic
- Safe to implement in code

---

## TASK 3 — Sorting & Grouping Logic (Agent 3)

Objective:
Implement correct grouping of places based on type/category.

Examples:
- Hotels → Hotels section
- Gyms → Gyms section
- Female-only → Female section

Actions:
- Implement server-side sorting logic:
  - Filter by type/category
  - Group places into correct sections
- Ensure sorting happens BEFORE rendering
- Do NOT change UI components
- Do NOT hardcode values without validation

Checklist:
- [ ] Sorting logic implemented server-side
- [ ] Categories mapped correctly
- [ ] No UI changes
- [ ] Empty categories handled safely
- [ ] `npm run build` passes locally

Exit Criteria:
- Places appear in correct sections locally

---

## TASK 4 — Overview & Benefits Integration (Agent 4)

Objective:
Ensure overview and benefits data appear correctly in the UI.

Actions:
- Pass overview data into existing components
- Pass benefits/features arrays into existing components
- Ensure text formatting matches previous behavior
- Handle missing or empty fields gracefully

Checklist:
- [ ] Overview renders correctly
- [ ] Benefits render correctly
- [ ] No layout or visual changes
- [ ] No runtime errors
- [ ] `npm run build` passes locally

Exit Criteria:
- Full place details visible and correct

---

## TASK 5 — Stability & Validation (Lead Agent)

Objective:
Confirm the API-driven data fully replaces static data and behaves
identically to the previous setup.

Actions:
- Remove any leftover mock/static data
- Verify:
  - Names
  - Images
  - Overview
  - Benefits
  - Correct section placement
- Final local build verification

Checklist:
- [ ] No mock data remains
- [ ] All place data sourced from API
- [ ] Sorting correct across sections
- [ ] No console or build errors
- [ ] Ready for Vercel deployment later

Exit Criteria:
- Website fully driven by API
- Data complete and correctly organized
- Local system stable and production-ready

---

END OF TASKS
