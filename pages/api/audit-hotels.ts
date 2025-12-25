/**
 * API Audit Endpoint
 * 
 * This endpoint inspects the Hotels API response and documents available fields.
 * Server-side only - does NOT expose API keys or raw data to clients.
 * 
 * Usage: GET /api/audit-hotels (local development only)
 */

import type { NextApiRequest, NextApiResponse } from "next";

// Define generic response type for audit purposes
type RawApiResponse = Record<string, unknown>;

// Configuration
const API_URL =
  process.env.ELITESPORT_GET_HOTELS_WEB_URL ?? process.env.ELITESPORT_API_URL;
const API_TOKEN = process.env.ELITESPORT_API_TOKEN;

async function fetchRawPlaces(): Promise<RawApiResponse[]> {
  if (!API_URL || !API_TOKEN) {
    throw new Error("Missing API configuration");
  }

  const authHeader = API_TOKEN.startsWith("Token ") ? API_TOKEN : `Token ${API_TOKEN}`;

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: authHeader,
    },
    body: JSON.stringify({}),
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  const json = await response.json();

  if (Array.isArray(json)) return json;
  if (Array.isArray(json.data)) return json.data;
  if (Array.isArray(json.results)) return json.results;

  return [];
}

type FieldInfo = {
  name: string;
  present: boolean;
  type: string;
  sampleValue?: unknown;
  uniqueValues?: unknown[];
  allValues?: unknown[];
};

type AuditResult = {
  success: boolean;
  totalRecords: number;
  fields: FieldInfo[];
  requiredFieldsStatus: Record<string, { present: boolean; coverage: string; possibleValues?: unknown[] }>;
  sampleRecord: RawApiResponse | null;
  allFieldsFound: string[];
  errors?: string[];
};

/**
 * Analyzes the field coverage across all records
 */
function analyzeFieldCoverage(
  records: RawApiResponse[],
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

/**
 * Collects all unique field names from records
 */
function collectAllFields(records: RawApiResponse[]): string[] {
  const fieldSet = new Set<string>();

  for (const record of records) {
    for (const key of Object.keys(record)) {
      fieldSet.add(key);
    }
  }

  return Array.from(fieldSet).sort();
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AuditResult | { error: string }>
) {
  // Only allow in development
  if (process.env.NODE_ENV === "production") {
    return res.status(403).json({ error: "Audit endpoint disabled in production" });
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    console.log("[Audit] Fetching places from API...");
    const hotels = await fetchRawPlaces();
    console.log(`[Audit] Received ${hotels.length} records`);

    // Collect all field names
    const allFieldsFound = collectAllFields(hotels);
    console.log("[Audit] Fields found:", allFieldsFound);

    // Analyze required fields for UI
    const nameAnalysis = analyzeFieldCoverage(hotels, "name");
    const imageAnalysis = analyzeFieldCoverage(hotels, "image");

    // Check for overview/description fields
    const overviewAnalysis = analyzeFieldCoverage(hotels, "overview");
    const descriptionAnalysis = analyzeFieldCoverage(hotels, "description");
    const aboutAnalysis = analyzeFieldCoverage(hotels, "about");

    // Check for benefits/features fields
    const benefitsAnalysis = analyzeFieldCoverage(hotels, "benefits");
    const featuresAnalysis = analyzeFieldCoverage(hotels, "features");
    const amenitiesAnalysis = analyzeFieldCoverage(hotels, "amenities");

    // Check for type/category fields
    const typeAnalysis = analyzeFieldCoverage(hotels, "type");
    const categoryAnalysis = analyzeFieldCoverage(hotels, "category");
    const placeTypeAnalysis = analyzeFieldCoverage(hotels, "placeType");
    const kindAnalysis = analyzeFieldCoverage(hotels, "kind");

    // Build detailed field info
    const fields: FieldInfo[] = allFieldsFound.map((fieldName) => {
      const analysis = analyzeFieldCoverage(hotels, fieldName);
      const sampleRecord = hotels.find(
        (h) => h[fieldName] !== undefined && h[fieldName] !== null
      );

      // For type/category fields, collect unique values
      const uniqueValues =
        ["type", "category", "placeType", "kind"].includes(fieldName)
          ? [...new Set(analysis.values)]
          : undefined;

      return {
        name: fieldName,
        present: analysis.present,
        type: sampleRecord
          ? typeof sampleRecord[fieldName]
          : "unknown",
        sampleValue: sampleRecord ? sampleRecord[fieldName] : undefined,
        uniqueValues,
        allValues:
          analysis.values.length <= 20 ? analysis.values : undefined,
      };
    });

    // Determine best overview field
    const overviewStatus = overviewAnalysis.present
      ? { present: true, coverage: overviewAnalysis.coverage }
      : descriptionAnalysis.present
        ? { present: true, coverage: descriptionAnalysis.coverage }
        : aboutAnalysis.present
          ? { present: true, coverage: aboutAnalysis.coverage }
          : { present: false, coverage: "0/0 (0%)" };

    // Determine best benefits field
    const benefitsStatus = benefitsAnalysis.present
      ? { present: true, coverage: benefitsAnalysis.coverage }
      : featuresAnalysis.present
        ? { present: true, coverage: featuresAnalysis.coverage }
        : amenitiesAnalysis.present
          ? { present: true, coverage: amenitiesAnalysis.coverage }
          : { present: false, coverage: "0/0 (0%)" };

    // Determine best type field
    const typeStatus = typeAnalysis.present
      ? {
        present: true,
        coverage: typeAnalysis.coverage,
        possibleValues: [...new Set(typeAnalysis.values)],
      }
      : categoryAnalysis.present
        ? {
          present: true,
          coverage: categoryAnalysis.coverage,
          possibleValues: [...new Set(categoryAnalysis.values)],
        }
        : placeTypeAnalysis.present
          ? {
            present: true,
            coverage: placeTypeAnalysis.coverage,
            possibleValues: [...new Set(placeTypeAnalysis.values)],
          }
          : kindAnalysis.present
            ? {
              present: true,
              coverage: kindAnalysis.coverage,
              possibleValues: [...new Set(kindAnalysis.values)],
            }
            : { present: false, coverage: "0/0 (0%)", possibleValues: [] };

    const result: AuditResult = {
      success: true,
      totalRecords: hotels.length,
      fields,
      requiredFieldsStatus: {
        name: { present: nameAnalysis.present, coverage: nameAnalysis.coverage },
        image: { present: imageAnalysis.present, coverage: imageAnalysis.coverage },
        overview: overviewStatus,
        benefits: benefitsStatus,
        type: typeStatus,
      },
      sampleRecord: hotels.length > 0 ? hotels[0] : null,
      allFieldsFound,
    };

    console.log("[Audit] Complete. Required fields status:", result.requiredFieldsStatus);

    return res.status(200).json(result);
  } catch (error) {
    console.error("[Audit] Error:", error);
    return res.status(500).json({
      success: false,
      totalRecords: 0,
      fields: [],
      requiredFieldsStatus: {
        name: { present: false, coverage: "Error" },
        image: { present: false, coverage: "Error" },
        overview: { present: false, coverage: "Error" },
        benefits: { present: false, coverage: "Error" },
        type: { present: false, coverage: "Error", possibleValues: [] },
      },
      sampleRecord: null,
      allFieldsFound: [],
      errors: [error instanceof Error ? error.message : "Unknown error"],
    });
  }
}

