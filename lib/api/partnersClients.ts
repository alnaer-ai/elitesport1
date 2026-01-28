/**
 * Partners & Clients API Client
 *
 * Server-side only module for fetching partners and clients data from the EliteSport API.
 * This module should only be used in getStaticProps, getServerSideProps, or API routes.
 */

// =============================================================================
// TYPES
// =============================================================================

/**
 * Raw partner data from the EliteSport API.
 * Endpoint: POST https://elitesport.online/api/get-partners-web
 */
export type PartnerApiResponse = {
    id: number;
    name: string;
    image: string;
};

/**
 * Raw client data from the EliteSport API.
 * Endpoint: POST https://elitesport.online/api/get-clients-web
 */
export type ClientApiResponse = {
    id: number;
    name: string;
    image: string;
};

/**
 * Full API response wrapper.
 */
export type ApiResult<T> = {
    data: T[];
    status?: "success" | "error";
};

/**
 * Unified entry type for display in UI.
 */
export type PartnerClientEntry = {
    _id: string;
    name: string;
    category: "client" | "partner";
    logoUrl: string;
    logoAlt: string;
    website?: string;
};

// =============================================================================
// CONFIGURATION
// =============================================================================

const API_BASE_URL = "https://elitesport.online";
const PARTNERS_API_URL = `${API_BASE_URL}/api/get-partners-web`;
const CLIENTS_API_URL = `${API_BASE_URL}/api/get-clients-web`;
const API_TOKEN = process.env.ELITESPORT_API_TOKEN;

// =============================================================================
// API CLIENT
// =============================================================================

/**
 * Fetches raw partners data from the EliteSport API.
 *
 * @returns Promise<PartnerApiResponse[]> - Array of partner data from API
 */
export async function fetchPartners(): Promise<PartnerApiResponse[]> {
    if (!API_TOKEN) {
        console.error(
            "[Partners API] Missing ELITESPORT_API_TOKEN environment variable"
        );
        return [];
    }

    try {
        const authHeader = API_TOKEN.startsWith("Token ")
            ? API_TOKEN
            : `Token ${API_TOKEN}`;

        const response = await fetch(PARTNERS_API_URL, {
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
                `[Partners API] Request failed with status ${response.status}:`,
                errorText
            );
            return [];
        }

        const data = await response.json();
        const partners: PartnerApiResponse[] = Array.isArray(data)
            ? data
            : Array.isArray(data?.data)
                ? data.data
                : [];

        return partners;
    } catch (error) {
        console.error("[Partners API] Unexpected error:", error);
        return [];
    }
}

/**
 * Fetches raw clients data from the EliteSport API.
 *
 * @returns Promise<ClientApiResponse[]> - Array of client data from API
 */
export async function fetchClients(): Promise<ClientApiResponse[]> {
    if (!API_TOKEN) {
        console.error(
            "[Clients API] Missing ELITESPORT_API_TOKEN environment variable"
        );
        return [];
    }

    try {
        const authHeader = API_TOKEN.startsWith("Token ")
            ? API_TOKEN
            : `Token ${API_TOKEN}`;

        const response = await fetch(CLIENTS_API_URL, {
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
                `[Clients API] Request failed with status ${response.status}:`,
                errorText
            );
            return [];
        }

        const data = await response.json();
        const clients: ClientApiResponse[] = Array.isArray(data)
            ? data
            : Array.isArray(data?.data)
                ? data.data
                : [];

        return clients;
    } catch (error) {
        console.error("[Clients API] Unexpected error:", error);
        return [];
    }
}

// =============================================================================
// MAPPING UTILITIES
// =============================================================================

/**
 * Constructs a full image URL from a relative path.
 * API returns relative paths like "/media/uploads/..." which need the base URL.
 *
 * @param imagePath - Relative image path from API
 * @returns Full URL or empty string if no path provided
 */
function getFullImageUrl(imagePath: string | undefined | null): string {
    if (!imagePath) return "";

    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
        return imagePath;
    }

    const separator = imagePath.startsWith("/") ? "" : "/";
    return `${API_BASE_URL}${separator}${imagePath}`;
}

/**
 * Maps a partner API response to the unified entry type.
 */
export function mapPartnerToEntry(partner: PartnerApiResponse): PartnerClientEntry {
    return {
        _id: `partner-${partner.id}`,
        name: partner.name,
        category: "partner",
        logoUrl: getFullImageUrl(partner.image),
        logoAlt: partner.name,
    };
}

/**
 * Maps a client API response to the unified entry type.
 */
export function mapClientToEntry(client: ClientApiResponse): PartnerClientEntry {
    return {
        _id: `client-${client.id}`,
        name: client.name,
        category: "client",
        logoUrl: getFullImageUrl(client.image),
        logoAlt: client.name,
    };
}

// =============================================================================
// PUBLIC API
// =============================================================================

/**
 * Fetches partners from the API and maps them to PartnerClientEntry objects.
 *
 * @returns Promise<PartnerClientEntry[]> - Array of partner entries
 */
export async function getPartners(): Promise<PartnerClientEntry[]> {
    try {
        const rawPartners = await fetchPartners();
        return rawPartners.map(mapPartnerToEntry);
    } catch (error) {
        console.error("[Partners API] Failed to fetch and map partners:", error);
        return [];
    }
}

/**
 * Fetches clients from the API and maps them to PartnerClientEntry objects.
 *
 * @returns Promise<PartnerClientEntry[]> - Array of client entries
 */
export async function getClients(): Promise<PartnerClientEntry[]> {
    try {
        const rawClients = await fetchClients();
        return rawClients.map(mapClientToEntry);
    } catch (error) {
        console.error("[Clients API] Failed to fetch and map clients:", error);
        return [];
    }
}

/**
 * Fetches both partners and clients and returns them as a combined array.
 *
 * @returns Promise<PartnerClientEntry[]> - Combined array of all entries
 */
export async function getPartnersAndClients(): Promise<PartnerClientEntry[]> {
    const [partners, clients] = await Promise.all([getPartners(), getClients()]);
    return [...partners, ...clients];
}
