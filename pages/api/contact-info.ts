import type { NextApiRequest, NextApiResponse } from "next";

import { sanityClient } from "@/lib/sanity.client";

type ContactInfo = {
  address?: string;
  mapLocation?: {
    lat?: number;
    lng?: number;
  };
};

type ContactInfoResponse = {
  data: ContactInfo | null;
  error?: string;
};

const CONTACT_INFO_QUERY = `
  *[_type == "contactInfo"][0]{
    address,
    mapLocation{
      lat,
      lng
    }
  }
`;

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse<ContactInfoResponse>
) {
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    response.status(405).json({ data: null, error: "Method Not Allowed" });
    return;
  }

  if (!sanityClient) {
    response
      .status(500)
      .json({ data: null, error: "Sanity client is not configured" });
    return;
  }

  try {
    const data = await sanityClient.fetch<ContactInfo | null>(CONTACT_INFO_QUERY);

    response.setHeader(
      "Cache-Control",
      "s-maxage=300, stale-while-revalidate=300"
    );
    response.status(200).json({ data });
  } catch (error) {
    console.error("Failed to fetch contact info", error);
    response
      .status(500)
      .json({ data: null, error: "Failed to fetch contact info" });
  }
}
