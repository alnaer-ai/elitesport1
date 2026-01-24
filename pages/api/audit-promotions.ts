/**
 * Promotions API Audit Endpoint
 *
 * This endpoint inspects the Promotions API response and documents available fields.
 * Server-side only - does NOT expose API keys or raw data to clients.
 *
 * Usage: GET /api/audit-promotions (local development only)
 */

import type { NextApiRequest, NextApiResponse } from "next";

// =============================================================================
// TYPES
// =============================================================================

/**
 * Raw promotion data from API response.
 * Based on actual API response structure observed from /get-promo-web endpoint.
 */
type PromotionApiResponse = {
  id: number;
  name?: string;
  discount?: number;
  image?: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  [key: string]: unknown;
};

type FieldInfo = {
  name: string;
  present: boolean;
  type: string;
  sampleValue?: unknown;
  uniqueValues?: unknown[];
  coverage: string;
};

type CategoryFieldStatus = {
  found: boolean;
  fieldName: string | null;
  exampleValues: unknown[];
  coverage: string;
  notes: string;
};

type AuditResult = {
  success: boolean;
  totalRecords: number;
  fields: FieldInfo[];
  categoryFieldAudit: {
    type: CategoryFieldStatus;
    category: CategoryFieldStatus;
    promo_type: CategoryFieldStatus;
    promotion_type: CategoryFieldStatus;
    kind: CategoryFieldStatus;
    classification: CategoryFieldStatus;
  };
  requiredFieldsStatus: {
    title: { present: boolean; coverage: string; apiField: string };
    image: { present: boolean; coverage: string; apiField: string };
    discount: { present: boolean; coverage: string; apiField: string };
    overview: { present: boolean; coverage: string; apiField: string };
    placeRelation: { present: boolean; coverage: string; apiField: string };
    validity: { present: boolean; coverage: string; apiField: string };
  };
  sampleRecords: PromotionApiResponse[];
  allFieldsFound: string[];
  errors?: string[];
};

// =============================================================================
// CONFIGURATION
// =============================================================================

const PROMOTIONS_API_URL = process.env.ELITESPORT_GET_PROMOTIONS_WEB_URL;
const API_TOKEN = process.env.ELITESPORT_API_TOKEN;

// =============================================================================
// API CLIENT
// =============================================================================

async function fetchPromotions(): Promise<PromotionApiResponse[]> {
  if (!PROMOTIONS_API_URL) {
    throw new Error(
      "[Promotions API] Missing ELITESPORT_GET_PROMOTIONS_WEB_URL environment variable"
    );
  }

  if (!API_TOKEN) {
    throw new Error(
      "[Promotions API] Missing ELITESPORT_API_TOKEN environment variable"
    );
  }

  const authHeader = API_TOKEN.startsWith("Token ")
    ? API_TOKEN
    : `Token ${API_TOKEN}`;

  const response = await fetch(PROMOTIONS_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: authHeader,
    },
    body: JSON.stringify({}),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "Unknown error");
    console.error(
      `[Promotions API] Request failed with status ${response.status}:`,
      errorText
    );
    throw new Error(
      `Promotions API request failed: ${response.status} ${response.statusText}`
    );
  }

  const data = await response.json();

  // API returns { data: [...], status: "success" }
  const promotions: PromotionApiResponse[] = Array.isArray(data)
    ? data
    : Array.isArray(data?.data)
      ? data.data
      : [];

  return promotions;
}

// =============================================================================
// ANALYSIS HELPERS
// =============================================================================

function analyzeFieldCoverage(
  records: PromotionApiResponse[],
  fieldName: string
): { present: boolean; coverage: string; values: unknown[] } {
  const values: unknown[] = [];
  let presentCount = 0;

  for (const record of records) {
    const value = record[fieldName];
    if (value !== undefined && value !== null && value !== "") {
      presentCount++;
      values.push(value);
    }
  }

  const percentage =
    records.length > 0 ? Math.round((presentCount / records.length) * 100) : 0;

  return {
    present: presentCount > 0,
    coverage: `${presentCount}/${records.length} (${percentage}%)`,
    values,
  };
}

function collectAllFields(records: PromotionApiResponse[]): string[] {
  const fieldSet = new Set<string>();

  for (const record of records) {
    for (const key of Object.keys(record)) {
      fieldSet.add(key);
    }
  }

  return Array.from(fieldSet).sort();
}

/**
 * Analyzes a specific field for category/type classification purposes.
 * Returns detailed info about whether the field exists, its values, and coverage.
 */
function analyzeCategoryField(
  records: PromotionApiResponse[],
  fieldName: string
): CategoryFieldStatus {
  const analysis = analyzeFieldCoverage(records, fieldName);
  const uniqueValues = [...new Set(analysis.values)];

  return {
    found: analysis.present,
    fieldName: analysis.present ? fieldName : null,
    exampleValues: uniqueValues.slice(0, 10), // Limit to 10 examples
    coverage: analysis.coverage,
    notes: analysis.present
      ? `Field "${fieldName}" found with ${uniqueValues.length} unique value(s)`
      : `Field "${fieldName}" not found in API response`,
  };
}

// =============================================================================
// HANDLER
// =============================================================================

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AuditResult | { error: string }>
) {
  // Only allow in development
  if (process.env.NODE_ENV === "production") {
    return res
      .status(403)
      .json({ error: "Audit endpoint disabled in production" });
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    console.log("[Promotions Audit] Fetching promotions from API...");
    const promotions = await fetchPromotions();
    console.log(`[Promotions Audit] Received ${promotions.length} records`);

    // Collect all field names
    const allFieldsFound = collectAllFields(promotions);
    console.log("[Promotions Audit] Fields found:", allFieldsFound);

    // === CATEGORY/TYPE FIELD AUDIT ===
    // Per Task 1: Look for any field representing category/type
    const categoryFieldAudit = {
      type: analyzeCategoryField(promotions, "type"),
      category: analyzeCategoryField(promotions, "category"),
      promo_type: analyzeCategoryField(promotions, "promo_type"),
      promotion_type: analyzeCategoryField(promotions, "promotion_type"),
      kind: analyzeCategoryField(promotions, "kind"),
      classification: analyzeCategoryField(promotions, "classification"),
    };

    console.log("[Promotions Audit] Category/Type Field Audit:", categoryFieldAudit);

    // Analyze fields for UI requirements
    const idAnalysis = analyzeFieldCoverage(promotions, "id");
    const nameAnalysis = analyzeFieldCoverage(promotions, "name");
    const discountAnalysis = analyzeFieldCoverage(promotions, "discount");
    const imageAnalysis = analyzeFieldCoverage(promotions, "image");
    const descriptionAnalysis = analyzeFieldCoverage(promotions, "description");
    const startDateAnalysis = analyzeFieldCoverage(promotions, "start_date");
    const endDateAnalysis = analyzeFieldCoverage(promotions, "end_date");

    // Check for place relationship fields (hotel, place, venue, location)
    const hotelAnalysis = analyzeFieldCoverage(promotions, "hotel");
    const placeAnalysis = analyzeFieldCoverage(promotions, "place");
    const venueAnalysis = analyzeFieldCoverage(promotions, "venue");
    const locationAnalysis = analyzeFieldCoverage(promotions, "location");
    const placeIdAnalysis = analyzeFieldCoverage(promotions, "place_id");
    const hotelIdAnalysis = analyzeFieldCoverage(promotions, "hotel_id");

    // Build detailed field info
    const fields: FieldInfo[] = allFieldsFound.map((fieldName) => {
      const analysis = analyzeFieldCoverage(promotions, fieldName);
      const sampleRecord = promotions.find(
        (p) => p[fieldName] !== undefined && p[fieldName] !== null
      );

      return {
        name: fieldName,
        present: analysis.present,
        type: sampleRecord ? typeof sampleRecord[fieldName] : "unknown",
        sampleValue: sampleRecord ? sampleRecord[fieldName] : undefined,
        coverage: analysis.coverage,
        uniqueValues:
          fieldName === "discount"
            ? [...new Set(analysis.values)].sort((a, b) =>
              Number(a) - Number(b)
            )
            : undefined,
      };
    });

    // Determine place relationship status
    const placeRelationStatus =
      hotelAnalysis.present || hotelIdAnalysis.present
        ? {
          present: true,
          coverage: hotelAnalysis.present
            ? hotelAnalysis.coverage
            : hotelIdAnalysis.coverage,
          apiField: hotelAnalysis.present ? "hotel" : "hotel_id",
        }
        : placeAnalysis.present || placeIdAnalysis.present
          ? {
            present: true,
            coverage: placeAnalysis.present
              ? placeAnalysis.coverage
              : placeIdAnalysis.coverage,
            apiField: placeAnalysis.present ? "place" : "place_id",
          }
          : venueAnalysis.present
            ? {
              present: true,
              coverage: venueAnalysis.coverage,
              apiField: "venue",
            }
            : locationAnalysis.present
              ? {
                present: true,
                coverage: locationAnalysis.coverage,
                apiField: "location",
              }
              : { present: false, coverage: "0/0 (0%)", apiField: "N/A" };

    // Validity status (start/end dates)
    const validityStatus =
      startDateAnalysis.present || endDateAnalysis.present
        ? {
          present: true,
          coverage:
            startDateAnalysis.present && endDateAnalysis.present
              ? `start_date: ${startDateAnalysis.coverage}, end_date: ${endDateAnalysis.coverage}`
              : startDateAnalysis.present
                ? startDateAnalysis.coverage
                : endDateAnalysis.coverage,
          apiField:
            startDateAnalysis.present && endDateAnalysis.present
              ? "start_date + end_date"
              : startDateAnalysis.present
                ? "start_date"
                : "end_date",
        }
        : { present: false, coverage: "0/0 (0%)", apiField: "N/A" };

    const result: AuditResult = {
      success: true,
      totalRecords: promotions.length,
      fields,
      categoryFieldAudit,
      requiredFieldsStatus: {
        title: {
          present: nameAnalysis.present,
          coverage: nameAnalysis.coverage,
          apiField: "name",
        },
        image: {
          present: imageAnalysis.present,
          coverage: imageAnalysis.coverage,
          apiField: "image",
        },
        discount: {
          present: discountAnalysis.present,
          coverage: discountAnalysis.coverage,
          apiField: "discount",
        },
        overview: {
          present: descriptionAnalysis.present,
          coverage: descriptionAnalysis.coverage,
          apiField: "description",
        },
        placeRelation: placeRelationStatus,
        validity: validityStatus,
      },
      sampleRecords: promotions.slice(0, 3),
      allFieldsFound,
    };

    console.log(
      "[Promotions Audit] Complete. Required fields status:",
      result.requiredFieldsStatus
    );

    return res.status(200).json(result);
  } catch (error) {
    console.error("[Promotions Audit] Error:", error);
    const emptyFieldStatus: CategoryFieldStatus = {
      found: false,
      fieldName: null,
      exampleValues: [],
      coverage: "Error",
      notes: "Error during API call",
    };
    return res.status(500).json({
      success: false,
      totalRecords: 0,
      fields: [],
      categoryFieldAudit: {
        type: emptyFieldStatus,
        category: emptyFieldStatus,
        promo_type: emptyFieldStatus,
        promotion_type: emptyFieldStatus,
        kind: emptyFieldStatus,
        classification: emptyFieldStatus,
      },
      requiredFieldsStatus: {
        title: { present: false, coverage: "Error", apiField: "N/A" },
        image: { present: false, coverage: "Error", apiField: "N/A" },
        discount: { present: false, coverage: "Error", apiField: "N/A" },
        overview: { present: false, coverage: "Error", apiField: "N/A" },
        placeRelation: { present: false, coverage: "Error", apiField: "N/A" },
        validity: { present: false, coverage: "Error", apiField: "N/A" },
      },
      sampleRecords: [],
      allFieldsFound: [],
      errors: [error instanceof Error ? error.message : "Unknown error"],
    });
  }
}

