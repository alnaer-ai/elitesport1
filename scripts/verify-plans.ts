
import { fetchPlans } from "../lib/api/plans";
import { getAvailablePlanTypes, buildTiersForPlanType } from "../lib/membership";

async function verify() {
    console.log("Starting Plans Verification...");

    try {
        const plans = await fetchPlans();
        console.log(`Fetched ${plans.length} plan categories.`);

        if (plans.length === 0) {
            console.warn("Warning: No plans returned. Check API URL and Token.");
        }

        const availableTypes = getAvailablePlanTypes(plans);
        console.log("Available Plan Types:", availableTypes);

        for (const plan of plans) {
            console.log(`\nCategory: ${plan.categoryName} (Slug: ${plan.categorySlug})`);
            console.log(`- Variants: ${plan.variants.length}`);

            for (const variant of plan.variants) {
                console.log(`  - Variant: ${variant.name}`);
                console.log(`    Type: ${variant.planType}`);
                console.log(`    Price: ${variant.price}`);
                console.log(`    Description Length: ${variant.descriptionHtml?.length}`);

                // Basic sanitization check
                if (variant.descriptionHtml && variant.descriptionHtml.includes("<script>")) {
                    console.error("    [ERROR] Unsafe tag <script> found!");
                }
                if (variant.descriptionHtml && variant.descriptionHtml.includes("onclick=")) {
                    console.error("    [ERROR] Unsafe attribute onclick found!");
                }

                // Check for style pollution (e.g. if we accidentally included styling fields)
                // Accessing via 'any' to check hidden fields
                const raw = variant as any;
                if (raw.card_bg || raw.primary_color) {
                    console.error("    [ERROR] Styling fields found in normalized object!");
                }
            }
        }

        // Check Tiers generation
        console.log("\nVerifying Tier Generation for 'single'...");
        const singleTiers = buildTiersForPlanType(plans, "single");
        console.log(`Generated ${singleTiers.length} single tiers.`);
        singleTiers.forEach(t => console.log(` - ${t.name}`));

        console.log("\nVerification Complete.");

    } catch (error) {
        console.error("Verification Failed:", error);
        process.exit(1);
    }
}

verify();
