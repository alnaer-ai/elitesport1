import type { NextApiRequest, NextApiResponse } from "next";

import { getContactInfo, type ContactInfo } from "@/lib/mockData";

type ContactInfoResponse = {
  data: Pick<ContactInfo, "address" | "mapLocation" | "phone" | "email" | "hours"> | null;
  error?: string;
};

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse<ContactInfoResponse>
) {
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    response.status(405).json({ data: null, error: "Method Not Allowed" });
    return;
  }

  try {
    const contact = getContactInfo();
    const data = {
      address: contact.address,
      mapLocation: contact.mapLocation,
      phone: contact.phone,
      email: contact.email,
      hours: contact.hours,
    };

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
