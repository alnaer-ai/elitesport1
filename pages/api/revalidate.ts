import type { NextApiRequest, NextApiResponse } from "next";

/**
 * Webhook handler for on-demand revalidation.
 * Previously used for Sanity CMS webhooks.
 * Now available for future API integration.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  // Verify webhook secret for security
  const secret = req.headers["x-revalidate-secret"] || req.body?.secret;
  const expectedSecret = process.env.REVALIDATE_SECRET;

  if (expectedSecret && secret !== expectedSecret) {
    return res.status(401).json({ message: "Invalid secret" });
  }

  try {
    const body = req.body;
    const documentType = body?._type;

    // Determine which paths to revalidate based on document type
    const pathsToRevalidate: string[] = [];

    if (documentType === "place") {
      pathsToRevalidate.push("/");
      pathsToRevalidate.push("/places");
      pathsToRevalidate.push("/promotions");
    } else if (documentType === "promotion") {
      pathsToRevalidate.push("/");
      pathsToRevalidate.push("/promotions");
    } else if (documentType === "page") {
      const slug = body?.slug?.current;
      if (slug) {
        const pageRouteMap: Record<string, string> = {
          home: "/",
          places: "/places",
          memberships: "/memberships",
          about: "/about",
          contact: "/contact",
          "partners-clients": "/partners-clients",
          promotions: "/promotions",
        };
        
        const route = pageRouteMap[slug];
        if (route) {
          pathsToRevalidate.push(route);
        }
      }
    } else if (documentType === "membershipInfo") {
      pathsToRevalidate.push("/memberships");
    }

    // Perform revalidation for each path
    const revalidationResults = await Promise.allSettled(
      pathsToRevalidate.map(async (path) => {
        try {
          await res.revalidate(path);
          return { path, status: "success" };
        } catch (error) {
          console.error(`Failed to revalidate ${path}:`, error);
          return { path, status: "error", error: String(error) };
        }
      })
    );

    const results = revalidationResults.map((result) => {
      if (result.status === "fulfilled") {
        return result.value;
      } else {
        return { path: "unknown", status: "error", error: String(result.reason) };
      }
    });

    return res.status(200).json({
      revalidated: true,
      message: `Revalidated ${pathsToRevalidate.length} path(s)`,
      results,
    });
  } catch (error) {
    console.error("Revalidation error:", error);
    return res.status(500).json({
      message: "Error revalidating",
      error: error instanceof Error ? error.message : String(error),
    });
  }
}
