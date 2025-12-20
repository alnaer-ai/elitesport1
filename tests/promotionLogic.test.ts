import test from "node:test";
import assert from "node:assert/strict";

import {
  isPromotionActive,
  mapPromotionRecordToCardContent,
  PROMOTION_FALLBACK_IMAGE,
  type PromotionRecord,
} from "../lib/promotionContent";

test("isPromotionActive returns false when not published", () => {
  assert.equal(isPromotionActive({ isPublished: false }), false);
});

test("isPromotionActive returns false when start date is in the future", () => {
  const future = new Date(Date.now() + 60_000).toISOString();
  assert.equal(isPromotionActive({ publishStartDate: future }), false);
});

test("isPromotionActive returns false when end date is in the past", () => {
  const past = new Date(Date.now() - 60_000).toISOString();
  assert.equal(isPromotionActive({ publishEndDate: past }), false);
});

test("isPromotionActive returns true when dates are valid and published", () => {
  const past = new Date(Date.now() - 60_000).toISOString();
  const future = new Date(Date.now() + 60_000).toISOString();
  assert.equal(
    isPromotionActive({ isPublished: true, publishStartDate: past, publishEndDate: future }),
    true
  );
});

test("isPromotionActive treats invalid dates as active", () => {
  assert.equal(isPromotionActive({ publishStartDate: "not-a-date" }), true);
});

test("mapPromotionRecordToCardContent uses promotion fields as source of truth", () => {
  const record: PromotionRecord = {
    _id: "promo-1",
    title: "Elite Gym Access",
    overviewText: "Overview copy.",
    discountPercentage: 50,
  };

  const card = mapPromotionRecordToCardContent(record, {
    fallbackImage: PROMOTION_FALLBACK_IMAGE,
    metaLabelFallback: "Member Exclusive",
  });

  assert.equal(card.id, "promo-1");
  assert.equal(card.title, "Elite Gym Access");
  assert.equal(card.metaLabel, "Member Exclusive");
  assert.equal(card.description, "Overview copy.");
});
