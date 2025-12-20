import type { NextApiRequest, NextApiResponse } from "next";

/**
 * Webhook handler for Sanity CMS to trigger on-demand revalidation.
 * 
 * Configure this endpoint in Sanity webhook settings:
 * - URL: https://your-domain.com/api/revalidate
 * - Trigger on: Create, Update, Delete
 * - Filter: _type == "place" || _type == "promotion" || _type == "page"
 * 
 * Set SANITY_REVALIDATE_SECRET in your environment variables for security.
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
  const secret = req.headers["x-sanity-secret"] || req.body?.secret;
  const expectedSecret = process.env.SANITY_REVALIDATE_SECRET;

  if (expectedSecret && secret !== expectedSecret) {
    return res.status(401).json({ message: "Invalid secret" });
  }

  try {
    const body = req.body;
    const documentType = body?._type;

    // Determine which paths to revalidate based on document type
    const pathsToRevalidate: string[] = [];

    if (documentType === "place") {
      // Revalidate surfaces that render place cards/modals
      pathsToRevalidate.push("/");
      pathsToRevalidate.push("/places");
      pathsToRevalidate.push("/promotions");
    } else if (documentType === "promotion") {
      // Promotions appear on home page and promotions page
      pathsToRevalidate.push("/");
      pathsToRevalidate.push("/promotions");
    } else if (documentType === "page") {
      // Revalidate based on page slug
      const slug = body?.slug?.current;
      if (slug) {
        // Map common page slugs to routes
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
    } else if (documentType === "clientPartner") {
      pathsToRevalidate.push("/");
      pathsToRevalidate.push("/partners-clients");
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
