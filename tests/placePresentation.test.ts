import test from "node:test";
import assert from "node:assert/strict";

import {
  DEFAULT_PLACE_DESCRIPTION,
  getPlaceCategoryLabel,
} from "../lib/placePresentation";

test("getPlaceCategoryLabel returns label for known categories", () => {
  assert.equal(getPlaceCategoryLabel("hotel"), "Hotel");
  assert.equal(getPlaceCategoryLabel("gym"), "Gym");
  assert.equal(getPlaceCategoryLabel("female"), "Female Club");
});

test("getPlaceCategoryLabel falls back to EliteSport when missing", () => {
  assert.equal(getPlaceCategoryLabel(undefined), "EliteSport");
  assert.equal(getPlaceCategoryLabel(null as unknown as string), "EliteSport");
});

test("DEFAULT_PLACE_DESCRIPTION provides a non-empty fallback string", () => {
  assert.equal(typeof DEFAULT_PLACE_DESCRIPTION, "string");
  assert.ok(DEFAULT_PLACE_DESCRIPTION.length > 0);
});

