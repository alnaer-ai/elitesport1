# EliteSport — Promotions Categories (Copy Directly from API)

Goal:
Organize promotions on the website using the category/type
EXACTLY as returned by the Promotions API.
No inference, no derivation, no fallback logic.

If the API does not provide a category/type, the promotion
must remain uncategorized.

Rules:
- Do NOT change UI, layout, styling, or routing
- Do NOT expose API keys
- Do NOT add new libraries
- All logic must be server-side
- Do NOT infer or guess categories
- Do NOT depend on Hotels or Places API
- Local first, Vercel later
- Each task must pass `npm run build` locally

---

## TASK 1 — Promotions API Category Field Audit (Agent 1)

Objective:
Identify whether the Promotions API provides a category/type field.

Actions:
- Call the Promotions API server-side
- Inspect the raw API response
- Look for any field representing category/type, such as:
  - type
  - category
  - promo_type
  - promotion_type
- Document:
  - Exact field name
  - Example values
  - Whether the field exists on all promotions or only some

Checklist:
- [x] Promotions API response inspected
- [x] Category/type field identified or confirmed missing
- [x] Exact field name documented
- [x] Example values documented

Exit Criteria:
- Clear confirmation of whether a category/type exists in the API

**RESULT:** ❌ Category/type field does NOT exist in the API.
See: `docs/TASK1_PROMOTIONS_CATEGORY_AUDIT.md`

---

## TASK 2 — Direct Category Copy Strategy (Agent 2)

Objective:
Define how the API-provided category/type will be copied as-is.

Actions:
- If API provides a category/type field:
  - Confirm it will be copied exactly with no transformation
- If API does NOT provide a category/type field:
  - Confirm no category logic will be added
- Define allowed behavior:
  - Promotions may have a category
  - Promotions may have no category
- No code changes yet

Checklist:
- [ ] Decision documented: category exists or not
- [ ] No transformation rules defined
- [ ] No fallback logic defined

Exit Criteria:
- Approved strategy to copy API category values directly

---

## TASK 3 — Server-Side Category Copy Implementation (Agent 3)

Objective:
Attach the API-provided category/type directly to promotion objects.

Actions:
- Implement server-side logic to:
  - Copy the category/type field exactly as returned by the API
- Do NOT:
  - Rename values
  - Normalize values
  - Infer values
- If the field is missing:
  - Leave the promotion without a category
- Do NOT modify UI components

Checklist:
- [ ] Category/type copied directly from API
- [ ] No transformation or inference logic
- [ ] Promotions without category remain uncategorized
- [ ] `npm run build` passes locally

Exit Criteria:
- Promotion objects reflect API category values exactly

---

## TASK 4 — Server-Side Grouping Using API Categories (Agent 4)

Objective:
Group promotions using only the API-provided category/type.

Actions:
- Group promotions server-side by the copied category field
- Do NOT create categories that do not exist in the API
- Ensure:
  - Promotions without category do not break rendering
  - Empty category groups are handled safely
- Keep UI unchanged

Checklist:
- [ ] Promotions grouped by API category only
- [ ] No artificial categories created
- [ ] UI unchanged
- [ ] No runtime errors
- [ ] `npm run build` passes locally

Exit Criteria:
- Promotions appear under sections that match API categories exactly

---

## TASK 5 — Validation & Stability Check (Lead Agent)

Objective:
Confirm category-based promotions work correctly and safely.

Actions:
- Verify:
  - Categories match API values exactly
  - No misplaced promotions
  - No duplicated promotions
- Remove temporary logs
- Final local build check

Checklist:
- [ ] Categories match API exactly
- [ ] No inference logic exists
- [ ] No UI changes
- [ ] No secrets exposed
- [ ] Local build passes

Exit Criteria:
- Promotions categorized strictly by API data
- System ready for future backend improvements

---

END OF TASKS
